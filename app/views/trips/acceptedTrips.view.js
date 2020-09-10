import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
import { find, propEq, isEmpty } from 'ramda';

import { getUserRole } from 'views/login/login.redux';
import {
  getAcknowledgedTrips,
  setMultiselectMode,
  resetMultiselectMode,
  toggleSelection,
  distributeTrips,
  showSearch,
  resetSearch,
  resetAllFilters,
  setSearchQuery,
  setSelectedFilters,
  activateRefresh,
  handleSortChangeForLotList,
  toggleModal,
  toggleFilterVisibility,
  hideSearch,
} from './trips.actions';

import FullScreenLoader from 'components/custom/FullScreenLoader';
import TripsListHeader from './components/ViewHeader';
import TripList from './components/TripList';
import SearchBar from 'components/custom/SearchBar';
import SortModal from 'components/custom/SortModal';
import FilterModal from 'views/filter/filter.view';
import { DistributeButtons } from '../lotlist/components/FAB';
import AssignedTo from 'views/distributed/components/AssignedTo';

import { DRIVER as DRIVER_ROLE } from 'constants/user/roles';
import { getNavBarRightButtons } from 'config/UserManager';
import NavListener from 'utils/NavigationListener';
import Locale from 'utils/locale';
import { countLots, hasDistributableTrips } from './helpers/tripHelpers';
import { defaultNavStyles } from 'styles';

// TODO: may need a pull to refresh for assigned trips
type Props = {
  +navigator: Object,
  +resetMultiselectMode: () => any,
  +setMultiselectMode: () => any,
  +toggleSelection: () => any,
  +selectedFilters: {
    [string]: string[],
  },
  +sort: {
    isModalVisible: boolean,
    selectedField: Object,
  },
  +role: number,
  +setSelectedFilters: () => any,
  +toggleFilterVisibility: () => any,
  +getAcknowledgedTrips: () => any,
  +resetAllFilters: () => any,
  +filterCount: number,
  +filterIsVisible: boolean,
  +isLoading: boolean,
  +isLoadingNextPage: boolean,
  +multiselect: Object,
  +selected: Object,
  +handleSortChangeForLotList: () => any,
  +toggleModal: () => any,
  +hideSearch: () => any,
  +page: number,
  +totalCount: number,
  +lotTotalCount: number,
};
class AcceptedTrips extends Component<Props> {
  constructor(props) {
    super(props);
    const { navigator } = this.props;
    navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  // componentWillMount() {
  //   this.props.navigator.setButtons({
  //     rightButtons: getNavBarRightButtons(hasDistributableTrips(this.props.trips), this.props.trips),
  //     animated: true,
  //   });
  // }

  onNavigatorEvent(event) {
    const { multiselect, trips, navigator, search } = this.props;
    if (event.type === 'DeepLink') {
      const links = event.link.split('/');
      if (links && links[0] === 'tab' && links[1] === '2' && links[2] === 'popToRoot') {
        navigator.popToRoot({
          animated: false,
        });
        return;
      }
      if (links[0] === 'acknowledged') {
        navigator.switchToTab({ tabIndex: 2 });
        NavListener.handleTabChange(2);
        const linkTripId = parseInt(links[1], 10);
        if (linkTripId) {
          const trip = find(propEq('tripId', linkTripId))(trips);
          if (trip && trip.lots) {
            const isAssignedAsDriver = trip.vendor_personnel_id !== null;
            const navbarRightButtons = getNavBarRightButtons(isAssignedAsDriver, trips);
            this.props.navigator.push({
              screen: 'CopartTransporter.LotList',
              title: Locale.translate('tab.Acknowledged.AcknowledgeLotsTitle'),
              passProps: {
                tripId: trip.tripId,
                tripName: trip.tripName,
                tripStatus: 'accepted',
                type: 'acceptedTrips',
                item: trip,
              },
              animated: false,
              navigatorButtons: {
                rightButtons: navbarRightButtons,
              },
              navigatorStyle: defaultNavStyles,
            });
          } else {
            // TODO: Dispatch proper error action
            throw new Error('Trip not found from deeplink');
          }
        }
      }
      return;
    }
    switch (event.id) {
      case 'backPress':
        navigator.switchToTab({ tabIndex: 0 });
        NavListener.handleTabChange(0);
        break;
      case 'willAppear':
        this.props
          .getAcknowledgedTrips({ navigator: this.props.navigator })
          .then(this.setNavigatorButtons);
        break;
      case 'distribute':
        if (multiselect.active) {
          this.props.resetMultiselectMode();
        } else {
          this.props.setMultiselectMode('distribute');
        }
        break;
      case 'didDisappear':
        if (multiselect.active) {
          this.props.resetMultiselectMode();
        }
        this.props.resetAllFilters('accepted', this.props.navigator);
        break;
      case 'search':
        if (!search.visible) {
          this.props.showSearch('accepted');
        }
        break;
      case 'bottomTabSelected':
        NavListener.handleTabChange(2);
        break;
      default:
        console.log('unhandled event', event.id); // eslint-disable-line
    }
  }
  setNavigatorButtons = () => {
    this.props.navigator.setButtons({
      rightButtons: getNavBarRightButtons(
        !hasDistributableTrips(this.props.trips),
        this.props.trips,
      ),
      animated: true,
    });
  };
  handleOnSelect = (tripId, item) => {
    const { multiselect, toggleSelection: tSelection, trips } = this.props;
    if (multiselect.active) {
      tSelection(tripId, item.dispatch_group_id);
    } else {
      const isAssignedAsDriver = item.vendor_personnel_id !== null;
      const navbarRightButtons = getNavBarRightButtons(isAssignedAsDriver, trips);
      this.props.navigator.push({
        screen: 'CopartTransporter.LotList',
        title: Locale.translate('tab.Acknowledged.AcknowledgeLotsTitle'),
        passProps: {
          tripId: item.tripId,
          tripName: item.tripName,
          tripStatus: 'accepted',
          type: 'acceptedTrips',
          item,
          comingFromTripList: true,
        },
        navigatorButtons: {
          rightButtons: navbarRightButtons,
        },
        navigatorStyle: defaultNavStyles,
      });
    }
  };

  handleOnAssign = (type: string) => {
    const { selected, trips, multiselect: { group: driverGroupId } } = this.props;
    const selectedTripCount = Object.values(selected).length;
    if (selectedTripCount === 0) {
      this.props.navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'warning',
          content: 'Please select 1 or more Lots',
        },
        autoDismissTimerSec: 1.0,
      });
    } else {
      this.props.navigator.showModal({
        screen: 'CopartTransporter.AssignToList',
        title: 'Assign To',
        navigatorStyle: {},
        passProps: {
          mode: 'trips',
          type,
          selected,
          trips,
          driverGroupId,
          tripType: 'accepted',
        },
      });
    }
  };
  applyFilter = (selectedFilters, totalCount) => {
    this.props.setSelectedFilters(selectedFilters, totalCount, 'accepted', this.props.navigator);
    this.props.navigator.dismissModal(); // TODO fix this
  };
  handleFiltersVisible = () => {
    this.props.toggleFilterVisibility('accepted');
  };

  handleSearchQuery = (query: string) => {
    this.props.setSearchQuery(query, 'accepted', this.props.navigator);
  };

  handleSelectedItem = (field: number | string) => {
    this.props.handleSortChangeForLotList(field, 'accepted', this.props.navigator);
  };

  handleModalVisible = () => {
    this.props.toggleModal('accepted');
  };
  handleRefresh = () => {
    this.props
      .getAcknowledgedTrips({ navigator: this.props.navigator })
      .then(this.setNavigatorButtons);
  };
  handleLoadNextPage = () => {
    if (!this.props.isLoadingNextPage) {
      const { page } = this.props;
      const nextPage = page + 1;
      this.props.getAcknowledgedTrips({ navigator: this.props.navigator, page: nextPage });
    }
  };

  resetSearch = (bucket: string) => {
    const { search, navigator } = this.props;
    if (isEmpty(search.query)) {
      this.props.hideSearch(bucket);
    } else this.props.resetSearch(bucket, navigator);
  };

  render() {
    const {
      isLoading,
      isLoadingNextPage,
      trips,
      multiselect,
      selected,
      search,
      filterCount,
      sort,
      role,
    } = this.props;
    const renderDistributeButttonIfSplitMode = renderIf(
      multiselect.active && multiselect.type === 'distribute',
    );
    const count = trips.length;
    const renderIfHasTripsAndSearchVisible = renderIf(
      (search.visible && count > 0) || search.query,
    );

    const renderIfHasTripsOrFilterAndSearchNotVisible = renderIf(
      !search.visible && (count > 0 || filterCount !== 0),
    );

    if (isLoading) {
      return <FullScreenLoader />;
    }
    return (
      <View style={{ flex: 1 }}>
        {renderIfHasTripsAndSearchVisible(
          <SearchBar
            query={search.query}
            placeholder="Enter Trip Id"
            resetSearchBar={() => this.resetSearch('accepted')}
            onSubmit={this.handleSearchQuery}
          />,
        )}
        {renderIfHasTripsOrFilterAndSearchNotVisible(
          <TripsListHeader
            tripcount={this.props.totalCount}
            lotcount={this.props.lotTotalCount}
            filterCount={filterCount}
            selected={selected}
            multiselect={multiselect}
            showMultiselect={false} // remove the multiselect button
            disabled={trips.length === 0}
            toggleAckMode={this.handleToggleAckMode}
            showFilters={this.handleFiltersVisible}
            onCancel={this.props.resetMultiselectMode}
            toggleModal={this.handleModalVisible}
          />,
        )}
        <TripList
          listType={'acceptedTrips'}
          data={trips}
          isLoadingNextPage={isLoadingNextPage}
          handleOnPress={this.handleOnSelect}
          multiselect={multiselect}
          action={multiselect.type}
          selected={selected}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadNextPage}
          renderExtraView={
            role !== DRIVER_ROLE
              ? (
                disabled,
                isAssignedAsDriver,
                hasLotWithIssue,
                itemNotDistributable,
                groupDoesNotMatchSelected,
              ) => item => (
                <AssignedTo
                  name={item.responsible_party_name}
                  status={item.status}
                  type={'trip'}
                  multiselect={multiselect.active}
                  action={multiselect.type}
                  isAssignedAsDriver={isAssignedAsDriver}
                  hasLotWithIssue={hasLotWithIssue}
                  disabled={disabled}
                  itemNotDistributable={itemNotDistributable}
                  groupDoesNotMatchSelected={groupDoesNotMatchSelected}
                />
              )
              : null
          }
        />
        <SortModal
          type={'trip'}
          isModalVisible={sort.isModalVisible}
          selectedItem={this.handleSelectedItem}
          cancelSort={this.handleModalVisible}
          selectedField={sort.selectedField}
        />
        <FilterModal
          applyFilter={this.applyFilter}
          bucket="accepted"
          selectedFilters={this.props.selectedFilters}
          totalCount={this.props.filterCount}
          closeFilters={this.handleFiltersVisible} // TODO: this
          isVisible={this.props.filterIsVisible} // TODO: this
          navigator={this.props.navigator}
        />
        {renderDistributeButttonIfSplitMode(
          <DistributeButtons
            role={this.props.role}
            onItemClick={this.handleOnAssign}
          />,
        )}
      </View>
    );
  }
}

AcceptedTrips.defaultProps = {
  multiselect: { active: false, type: '' },
  selected: {},
  trips: [],
};

AcceptedTrips.propTypes = {
  trips: PropTypes.array, // eslint-disable-line
  // type: PropTypes.string.isRequired,
  search: PropTypes.object.isRequired, // eslint-disable-line
  setSearchQuery: PropTypes.func.isRequired,
  // toggleSearchVisible: PropTypes.func.isRequired,
  // activateRefresh: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
  showSearch: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  getAcknowledgedTrips,
  setMultiselectMode,
  resetMultiselectMode,
  toggleSelection,
  distributeTrips,
  showSearch,
  resetSearch,
  resetAllFilters,
  setSearchQuery,
  setSelectedFilters,
  activateRefresh,
  handleSortChangeForLotList,
  toggleModal,
  toggleFilterVisibility,
  hideSearch,
};

const acceptedTripsSelector = state => ({
  trips: state.trips.accepted.trips,
  isLoading: state.trips.accepted.isLoading,
  isLoadingNextPage: state.trips.accepted.isLoadingNextPage,
  multiselect: state.trips.multiselect,
  selected: state.trips.selected,
  search: state.trips.accepted.search,
  selectedFilters: state.trips.accepted.filters.selectedFilters,
  filterCount: state.trips.accepted.filters.totalCount,
  filterIsVisible: state.trips.accepted.filters.isVisible,
  sort: state.trips.accepted.sort,
  role: getUserRole(state),
  totalCount: state.trips.accepted.count,
  page: state.trips.accepted.page,
  lotTotalCount: state.home.counts.acceptedTrips,
});

export default connect(acceptedTripsSelector, mapDispatchToProps)(AcceptedTrips);
