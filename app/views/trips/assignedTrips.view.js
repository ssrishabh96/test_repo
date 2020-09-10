import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
import { find, propEq, isEmpty } from 'ramda';

import { getUserRole } from 'views/login/login.redux';
import {
  getAssignedTrips,
  setMultiselectMode,
  resetMultiselectMode,
  toggleSelection,
  distributeTrips,
  tripAction,
  showSearch,
  resetSearch,
  setSearchQuery,
  setSelectedFilters,
  resetAllFilters,
  activateRefresh,
  handleSortChangeForLotList,
  toggleModal,
  toggleFilterVisibility,
  hideSearch,
} from './trips.actions';

import SearchBar from 'components/custom/SearchBar';
import SortModal from 'components/custom/SortModal';
import FilterModal from 'views/filter/filter.view';
import FullScreenLoader from 'components/custom/FullScreenLoader';
import LoadingOverlay from 'components/custom/FullScreenLoader/LoadingOverlay';
import TripsListHeader from './components/ViewHeader';
import TripList from './components/TripList';
import { DistributeButtons } from '../lotlist/components/FAB';
import AssignedTo from 'views/distributed/components/AssignedTo';

import { DRIVER as DRIVER_ROLE } from 'constants/user/roles';
import { getNavBarRightButtons } from 'config/UserManager';
import NavListener from 'utils/NavigationListener';
import Locale from 'utils/locale';
import { getSelectedTripNames, countLots, hasDistributableTrips } from './helpers/tripHelpers';

// TODO may need a pull to refresh for assigned trips
type Props = {
  +navigator: Object,
  +selectedFilters: {
    [string]: string[],
  },
  +sort: {
    isModalVisible: boolean,
    selectedField: Object,
  },
  +role: number,
  +getAssignedTrips: () => any,
  +resetMultiselectMode: () => any,
  +setMultiselectMode: () => any,
  +toggleSelection: () => any,
  +setSelectedFilters: () => any,
  +toggleFilterVisibility: () => any,
  +resetAllFilters: () => any,
  +showSearch: () => any,
  +resetSearch: (bucket: string) => any,
  +filterCount: number,
  +filterIsVisible: boolean,
  +isLoading: boolean,
  +isLoadingNextPage: boolean,
  +multiselect: Object,
  +selected: Object,
  +handleSortChangeForLotList: () => any,
  +toggleModal: () => any,
  +hideSearch: () => any,
  +tripAction: (
    selectedTrips: Array<string>,
    response: string,
    params: Object,
    navigator: Object,
    goBackToListView?: Function,
  ) => any,
  +page: number,
  +totalCount: number,
};

class AssignedTrips extends Component<Props> {
  constructor(props) {
    super(props);
    const { navigator } = this.props;
    navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  // componentWillMount() {
  //   this.props.navigator.setButtons({
  //     rightButtons: getNavBarRightButtons(false, this.props.trips),
  //     animated: true,
  //   });
  // }

  onNavigatorEvent(event) {
    const { multiselect, navigator, search } = this.props;
    if (event.type === 'DeepLink') {
      const links = event.link.split('/');
      if (links && links[0] === 'tab' && links[1] === '1' && links[2] === 'popToRoot') {
        navigator.popToRoot({
          animated: false,
        });
        return;
      }
      if (links && links[0] === 'popTo' && links[1] === 'tripList') {
        navigator.pop();
      }
    }
    switch (event.id) {
      case 'backPress':
        navigator.switchToTab({ tabIndex: 0 });
        NavListener.handleTabChange(0);
        break;
      case 'willAppear':
        this.props.getAssignedTrips({ navigator }).then(this.setNavigatorButtons);
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
        this.props.resetAllFilters('assigned', this.props.navigator);
        break;
      case 'search':
        if (!search.visible) {
          this.props.showSearch('assigned');
        }
        break;
      case 'bottomTabSelected':
        NavListener.handleTabChange(1);
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
  handleToggleAckMode = () => {
    const { multiselect } = this.props;
    if (multiselect.active) {
      this.props.resetMultiselectMode();
    } else {
      this.props.setMultiselectMode('response');
    }
  };

  handleOnSelect = (tripId, item) => {
    const { multiselect, toggleSelection: tSelection, trips } = this.props;
    if (multiselect.active) {
      tSelection(tripId, item.dispatch_group_id);
    } else {
      const isAssignedAsDriver = item.vendor_personnel_id !== null;
      const navbarButtons = getNavBarRightButtons(isAssignedAsDriver, trips);
      const hasIssue = item.rejection_reason !== null && item.override_reason === null;
      this.props.navigator.push({
        screen: 'CopartTransporter.LotList',
        title: Locale.translate('tab.Assigned.LotList'),
        passProps: {
          tripId: item.tripId,
          tripName: item.tripName,
          tripStatus: 'assigned',
          type: 'assignedTrips',
          item,
          hasIssue,
          /**
           * hasIssue is used to disable `accept` or `reject` button if active issue
           * is present on a Trip item in the `Assigned` bucket. But currently, the trip
           * is not shown at all if it has an active issue present. Will keep this around
           *  just in case it is needed in future.
           */
        },
        navigatorButtons: {
          rightButtons: navbarButtons,
        },
      });
    }
  };

  sendResponse = (response) => {
    const { selected, navigator, trips } = this.props;
    const selectedTrips = getSelectedTripNames(selected);
    if (selectedTrips.length === 0) {
      this.props.navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'warning',
          content: 'Please select 1 or more Trips',
        },
        autoDismissTimerSec: 1.0,
      });
      return;
    }

    if (response === 'acknowledge') {
      this.props.tripAction(selectedTrips, response, {}, navigator);
    } else if (response === 'decline') {
      const trip = find(propEq('tripId', parseInt(selectedTrips[0], 10)))(trips);
      navigator.showModal({
        screen: 'CopartTransporter.NewIssue',
        title: 'Can\'t Pickup',
        passProps: {
          entity: 'trip',
          bucket: 'assigned',
          data: selectedTrips,
          trip,
          comingFromTripList: true, // to pop back twice and reach trips list
        },
      });
    }
  };

  handleOnAssign = (type: string) => {
    const { selected, trips, multiselect: { group: driverGroupId } } = this.props;
    const selectedTripCount = getSelectedTripNames(selected).length;
    if (selectedTripCount === 0) {
      this.props.navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'warning',
          content: 'Please select 1 or more Trips',
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
          tripType: 'assigned',
        },
      });
    }
  };

  handleSearchQuery = (query: string) => {
    this.props.setSearchQuery(query, 'assigned', this.props.navigator);
  };
  applyFilter = (selectedFilters, totalCount) => {
    this.props.setSelectedFilters(selectedFilters, totalCount, 'assigned', this.props.navigator);
    this.props.navigator.dismissModal();
  };
  handleFiltersVisible = () => {
    this.props.toggleFilterVisibility('assigned');
  };

  handleSelectedItem = (field: number | string) => {
    // const { trips } = this.props;
    this.props.handleSortChangeForLotList(field, 'assigned', this.props.navigator);
  };

  handleModalVisible = () => {
    this.props.toggleModal('assigned');
  };
  handleRefresh = () => {
    this.props.getAssignedTrips({}, this.props.navigator).then(this.setNavigatorButtons);
  };
  handleLoadNextPage = () => {
    if (!this.props.isLoadingNextPage) {
      const { page } = this.props;
      const nextPage = page + 1;
      this.props.getAssignedTrips({ navigator: this.props.navigator, page: nextPage });
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
      trips,
      isLoading,
      isLoadingNextPage,
      multiselect,
      selected,
      search,
      loading,
      filterCount,
      sort,
      role,
    } = this.props;
    const renderDistributeButttonIfSplitMode = renderIf(multiselect.type === 'distribute');
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
        <LoadingOverlay loading={loading} />
        {renderIfHasTripsAndSearchVisible(
          <SearchBar
            query={search.query}
            placeholder="Enter Trip Id"
            resetSearchBar={() => this.resetSearch('assigned')}
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
            disabled={trips.length === 0}
            toggleAckMode={this.handleToggleAckMode}
            showFilters={this.handleFiltersVisible}
            onCancel={this.props.resetMultiselectMode}
            toggleModal={this.handleModalVisible}
          />,
        )}
        <TripList
          listType={'assignedTrips'}
          data={trips}
          handleOnPress={this.handleOnSelect}
          multiselect={multiselect}
          action={multiselect.type}
          selected={selected}
          onAccept={() => this.sendResponse('acknowledge')}
          onReject={() => this.sendResponse('decline')}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadNextPage}
          isLoadingNextPage={isLoadingNextPage}
          navigator={this.props.navigator}
          renderExtraView={
            role !== DRIVER_ROLE
              ? (
                disabled,
                isAssignedAsDriver,
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
          bucket="assigned"
          selectedFilters={this.props.selectedFilters}
          totalCount={this.props.filterCount}
          closeFilters={this.handleFiltersVisible} // TODO: this
          isVisible={this.props.filterIsVisible} // TODO: this
          navigator={this.props.navigator}
        />
        {renderDistributeButttonIfSplitMode(
          <DistributeButtons
            role={role}
            onItemClick={this.handleOnAssign}
          />,
        )}
      </View>
    );
  }
}

AssignedTrips.defaultProps = {
  multiselect: { active: false, type: '' },
  selected: {},
  trips: [],
  loading: false,
};

AssignedTrips.propTypes = {
  trips: PropTypes.array, //eslint-disable-line
  showSearch: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  search: PropTypes.object.isRequired, //eslint-disable-line
  // activateRefresh: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  getAssignedTrips,
  setMultiselectMode,
  resetMultiselectMode,
  toggleSelection,
  distributeTrips,
  showSearch,
  resetSearch,
  setSearchQuery,
  setSelectedFilters,
  resetAllFilters,
  activateRefresh,
  handleSortChangeForLotList,
  toggleModal,
  toggleFilterVisibility,
  tripAction,
  hideSearch,
};

const assignedTripsSelector = state => ({
  loading: state.trips.loading,
  trips: state.trips.assigned.trips,
  isLoading: state.trips.assigned.isLoading,
  isLoadingNextPage: state.trips.assigned.isLoadingNextPage,
  search: state.trips.assigned.search,
  multiselect: state.trips.multiselect,
  selected: state.trips.selected,
  selectedFilters: state.trips.assigned.filters.selectedFilters,
  filterCount: state.trips.assigned.filters.totalCount,
  filterIsVisible: state.trips.assigned.filters.isVisible,
  sort: state.trips.assigned.sort,
  role: getUserRole(state),
  totalCount: state.trips.assigned.count,
  page: state.trips.assigned.page,
  lotTotalCount: state.home.counts.assignedTrips,
});

export default connect(assignedTripsSelector, mapDispatchToProps)(AssignedTrips);
