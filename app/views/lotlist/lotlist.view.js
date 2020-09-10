// @flow

import type { Props, CheckinButtonsProps } from './types';
import type { Lot } from 'types/Lot';

import React, { Component } from 'react';
import { View, Image, Modal } from 'react-native';
import { find, propEq, prop, keys, compose, filter, isEmpty } from 'ramda';
import renderIf from 'render-if';
import ActionButton from 'react-native-action-button';

import { AcknowledgeButtonGroup } from 'components/core/ButtonGroup';
import SearchBar from 'components/custom/SearchBar';
import SortModal from 'components/custom/SortModal';
import FilterModal from 'views/filter/filter.view';
import FullScreenLoader from 'components/custom/FullScreenLoader';
import LotViewHeader from './components/ViewHeader';
import LotList from './components/LotList';
import SectionedLotList from './components/SectionedLotList';
import { DistributeButtons } from './components/FAB';
import { OfflineBanner } from 'components/custom/Banner';
import AwaitingSyncView from './components/AwaitingSyncView';

import { getSelectedLotNames, bucketMap } from './lotlist.helper';
import { getLotTripTypeInfo } from 'constants/tripTypeMap';

import NavListener from 'utils/NavigationListener';
import { defaultNavStyles } from 'styles';
import icons from 'constants/icons';
import colors from 'styles/colors';

const lotListScreenTypes = ['inProgress', 'inTransit', 'completed', 'distributedTrips'];
const filterOnlyAwaitingSync = filter(prop('isAwaitingSync'));
const getAwaitingSyncIds = compose(keys, filterOnlyAwaitingSync);

const CheckinButtons = ({ onPress }: CheckinButtonsProps) => (
  <ActionButton
    buttonColor={colors.LIGHT_GREEN}
    icon={<Image
      style={{ height: 30, width: 30 }}
      source={icons.checkWhite}
    />}
    onPress={onPress}
  />
);

class LotListContainer extends Component<Props> {
  static defaultProps = {
    lotList: {
      lots: [],
      isLoading: false,
      isLoadingNextPage: false,
    },
    type: 'lotList', // default bucket for child view.
    multiselect: {},
    selectedLots: {},
    inProgressCache: {},
  };

  static navigatorStyle = defaultNavStyles;

  static navigatorButtons = {
    rightButtons: [
      {
        id: 'search',
        icon: icons.tripsScreen.tripIconSearch,
      },
    ],
  };

  constructor(props: Props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentWillMount() {
    const { item, type } = this.props;
    if (type === 'assignedTrips' || type === 'acceptedTrips' || type === 'distributedTrips') {
      this.props.setCurrentLotList(item.lots);
    }
  }

  onNavigatorEvent = (event: Object) => {
    const { multiselect, navigator, lotList, type: lotListType, tripStatus } = this.props;
    const search = this.props.lotList.search;
    // pass on the lot bucket to the respective lot view
    const lotBucket = tripStatus || lotListType;
    if (event.type === 'DeepLink') {
      const links = event.link.split('/');
      // if (links[0] === 'popTo' && links[1] === 'lotList') {
      //   navigator.pop();
      //   return;
      // }

      if (
        lotListType === 'inProgress' &&
        links &&
        links[0] === 'tab' &&
        links[1] === '3' &&
        links[2] === 'popToRoot'
      ) {
        navigator.popToRoot({
          animated: false,
        });
        return;
      }
      if (
        lotListType === 'inTransit' &&
        links &&
        links[0] === 'tab' &&
        links[1] === '4' &&
        links[2] === 'popToRoot'
      ) {
        navigator.popToRoot({
          animated: false,
        });
        return;
      }
      if (links[0] === 'inProgress' && lotListType === 'inProgress') {
        navigator.dismissAllModals();
        navigator.switchToTab({ tabIndex: 3 });
        NavListener.handleTabChange(3);
        if (links[1]) {
          const lot = find(propEq('number', parseInt(links[1], 10)))(lotList.lots);
          if (lot && lot.tripType) {
            this.props.navigator.push({
              screen: 'CopartTransporter.LotView',
              title: getLotTripTypeInfo(lot).lotViewTitle,
              passProps: {
                lotNumber: links[1],
                lot,
                lotBucket,
              },
              animated: false,
            });
          } else {
            // TODO: Dispatch proper error action
            throw new Error('Lot not found from deeplink');
          }
        }
      }
      return;
    }
    if (event.id === 'backPress' && (lotListType === 'inProgress' || lotListType === 'inTransit')) {
      this.props.navigator.switchToTab({ tabIndex: 0 });
      NavListener.handleTabChange(0);
    }
    switch (event.id) {
      case 'bottomTabSelected':
        if (lotListType === 'inProgress') NavListener.handleTabChange(3);
        if (lotListType === 'inTransit') NavListener.handleTabChange(4);
        break;
      case 'willAppear':
        if (this.props.type === 'inProgress' && this.props.connectionStatus) {
          this.props.getInProgressLotList(this.props.navigator);
        }
        if (this.props.type === 'inTransit') {
          this.props.getInTransitLotList(this.props.navigator);
        }
        if (this.props.type === 'completed') {
          this.props.getCompletedLotList(this.props.navigator);
        }
        break;
      case 'distribute':
        if (multiselect.active) {
          this.props.resetMultiselectMode();
        } else {
          // check if trip has issues
          const tripObj = prop('item')(this.props);
          if (tripObj && keys(tripObj.issue).length > 0) {
            this.props.navigator.showInAppNotification({
              screen: 'CopartTransporter.ShowInAppNotification',
              passProps: {
                type: 'warning',
                content: 'Trip has issues, please resolve them first.',
              },
              autoDismissTimerSec: 1.0,
            });
            return;
          }
          this.props.setMultiselectMode('distribute');
        }
        break;
      case 'checkin':
        if (multiselect.active) {
          this.props.resetMultiselectMode();
        } else {
          this.props.setMultiselectMode('checkin');
        }
        break;
      case 'didDisappear':
        if (multiselect.active) {
          this.props.resetMultiselectMode();
        }
        this.props.resetAllFilters(bucketMap[lotListType], this.props.navigator);
        break;
      case 'search':
        if (!search.visible) {
          this.props.showSearch(bucketMap[lotListType]);
        }
        break;
      default:
        console.log('unhandled event in LotList View: ', event.id);
    }
  };

  getLocationByTripType = (lot: Object) => {
    if (['P', 'D', 'S', 'B', 'T'].includes(lot.tripType)) {
      return {
        lotNumber: lot.number,
        lotDescription: lot.description,
        lat: lot.destination.latitude,
        lng: lot.destination.longitude,
        city: lot.destination.city,
        street: lot.destination.line_1,
      };
    }
    return {
      lotNumber: lot.number,
      lotDescription: lot.description,
      lat: 0,
      lng: 0,
    };
  };

  handleOnLotSelect = (lotNumber: number, lot: Lot) => {
    if (this.props.canNavigateToLot === false) {
      return;
    }
    const { multiselect, tripStatus, type } = this.props;
    const lotBucket = tripStatus || type;
    if (multiselect.active) {
      this.props.toggleSelection(lot.dispatch_assignment_detail_id);
    } else {
      const dispatchId = lot.dispatch_assignment_detail_id;
      this.props.navigator.push({
        screen: 'CopartTransporter.LotView',
        title: getLotTripTypeInfo(lot).lotViewTitle,
        passProps: {
          lotNumber,
          lot,
          lotBucket,
          trip: this.props.item,
          comingFromTripList: this.props.comingFromTripList,
        },
      });
    }
  };

  handleOnAcceptTrip = () => {
    const { item: trip, navigator } = this.props;
    this.props.acknowledgeTrip(trip.tripId, navigator, true);
  };

  handleOnRejectTrip = () => {
    this.props.navigator.showModal({
      screen: 'CopartTransporter.NewIssue',
      title: 'Can\'t Pickup',
      passProps: {
        entity: 'trip',
        bucket: 'assigned',
        data: [this.props.tripId],
        trip: this.props.item,
        comingFromTripList: true,
      },
    });
  };

  showNoLotsSelectedMessage = () => {
    this.props.navigator.showInAppNotification({
      screen: 'CopartTransporter.ShowInAppNotification',
      passProps: {
        type: 'warning',
        content: 'Please select 1 or more Lots',
      },
      autoDismissTimerSec: 1,
    });
  };

  assignLotsTo = (type: string) => {
    const { tripStatus, tripId, selectedLots, lotList: { lots }, type: bucket } = this.props;
    const selectedLotsCount = getSelectedLotNames(selectedLots).length;

    if (selectedLotsCount === 0) {
      this.showNoLotsSelectedMessage();
    } else {
      const goBackIfNoLots = () => this.props.navigator.pop();

      const driverGroupId = lots[0].dispatch_group_id;

      this.props.navigator.showModal({
        screen: 'CopartTransporter.AssignToList',
        title: 'Assign To',
        navigatorStyle: {},
        passProps: {
          mode: 'lots',
          bucket,
          type,
          selectedLots,
          tripStatus,
          driverGroupId,
          tripId,
          hasLotsLeft: selectedLotsCount !== lots.length,
          goBackIfNoLots,
        },
      });
    }
  };

  toggleModeToCheckIn = () => {
    const { lotList: { lots }, multiselect } = this.props;
    if (lots.length === 0) {
      // show notification
    } else if (multiselect.active) {
      this.props.resetMultiselectMode();
    } else {
      this.props.setMultiselectMode('checkin');
    }
  };

  handleSubmitForCheckIn = () => {
    const { selectedLots, navigator } = this.props;
    const selectedLotsCount = getSelectedLotNames(selectedLots).length;
    if (selectedLotsCount === 0) {
      this.showNoLotsSelectedMessage();
    } else {
      this.props.checkInLots(selectedLots, navigator);
    }
  };

  handleSearchQuery = (query: string) => {
    if (bucketMap[this.props.type] === 'lotList') {
      return this.props.setSearchQuery(query, bucketMap[this.props.type], this.props.navigator);
    }
    return () => null;
  };

  handleSearchSubmit = (query: string) => {
    if (bucketMap[this.props.type] === 'lotList') return () => null;
    return this.props.setSearchQuery(query, bucketMap[this.props.type], this.props.navigator);
  };

  applyFilter = (selectedFilters: Object, totalCount: number) => {
    const bucket = bucketMap[this.props.type];
    this.props.setSelectedFilters(selectedFilters, totalCount, bucket, this.props.navigator); // bucket?
    this.props.navigator.dismissModal();
  };

  handleFiltersVisible = () => {
    const bucket = bucketMap[this.props.type];
    this.props.toggleFilterVisibility(bucket);
  };

  filteredLots = () => {
    const { lotList: lots, search } = this.props;
    if (search.visible && (search.result && search.result.length > 0)) {
      return search.result;
    } else if (search.visible && (search.result && search.result.length === 0)) {
      return null;
    }
    return lots;
  };

  handleSelectedItem = (field: number | string) => {
    // const { trips } = this.props;
    this.props.handleSortChangeForLotList(field, bucketMap[this.props.type]);
  };

  handleSortVisible = () => {
    this.props.toggleSortVisibility(bucketMap[this.props.type]);
  };

  handleRefresh = () => {
    if (this.props.type === 'inProgress') {
      if (this.props.connectionStatus) this.props.getInProgressLotList(this.props.navigator);
      else {
        this.props.navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'warning',
            content: 'Cannot refresh when you are offline',
          },
          autoDismissTimerSec: 1.0,
        });
      }
    }
    if (this.props.type === 'inTransit') {
      this.props.getInTransitLotList(this.props.navigator);
    }
    if (this.props.type === 'completed') {
      this.props.getCompletedLotList(this.props.navigator);
    }
  };

  handleOpenMapView = () => {
    const { lotList: { lots } } = this.props;
    this.props.navigator.push({
      screen: 'CopartTransporter.MapView',
      passProps: { lots },
    });
  };

  handleSyncAll = () => {
    const dispatchIds = getAwaitingSyncIds(this.props.inProgressCache);
    this.props.navigator.showModal({
      screen: 'CopartTransporter.SyncingView',
      title: 'Syncing',
      overrideBackPress: true,
      backButtonHidden: true,
      passProps: { lotsToSync: dispatchIds },
    });
  };

  handleLoadNextPage = () => {
    const { lotList: { page } } = this.props;
    const nextPage = page + 1;
    if (!this.props.lotList.isLoadingNextPage) {
      if (this.props.type === 'inProgress') {
        this.props.getInProgressLotList(this.props.navigator, nextPage);
      }
      if (this.props.type === 'inTransit') {
        this.props.getInTransitLotList(this.props.navigator, nextPage);
      }
    }
  };

  resetSearch = (bucket: string) => {
    const { lotList: { search }, navigator } = this.props;
    if (isEmpty(search.query)) {
      this.props.hideSearch(bucket);
    } else this.props.resetSearch(bucket, navigator);
  };

  render() {
    const {
      lotList: { lots, filteredLots, isLoading, filters, search, sort, isLoadingNextPage, count },
      tripStatus,
      tripId,
      tripName,
      multiselect,
      selectedLots,
      navigator,
      type,
      connectionStatus,
      inProgressCache,
    } = this.props;

    const totalCount = count || (lots && lots.length) || 0;

    const filterCount = filters.totalCount;
    const awaitingSyncCount = getAwaitingSyncIds(inProgressCache).length;
    const renderLotList = renderIf(type !== 'completed' && type !== 'distributedTrips');
    const renderSectionedLotList = renderIf(type === 'completed');
    const renderDistributedTripsLotlist = renderIf(type === 'distributedTrips');

    const renderIfDefaultAssigned = renderIf(!multiselect.active && tripStatus === 'assigned');

    const renderIfMultiselectAssigned = renderIf(
      multiselect.active && (multiselect.type === 'distribute' && totalCount > 0),
    );
    const renderIfInTransitListAndCheckIn = renderIf(
      multiselect.active && (multiselect.type === 'checkin' && totalCount > 0),
    );
    const renderIfSearchVisible = renderIf((search.visible && totalCount > 0) || search.query);

    // const renderIfHasLotsAndSearchNotVisible = renderIf(!search.visible && totalCount > 0);
    const renderIfHasLotsOrFilterAndSearchNotVisible = renderIf(
      !search.visible && (totalCount > 0 || filterCount !== 0),
    );

    const renderIfInProgressAndOffline = renderIf(type === 'inProgress' && !connectionStatus);
    if (isLoading) {
      return <FullScreenLoader />;
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.OFF_WHITE,
        }}
      >
        {renderIfSearchVisible(
          <SearchBar
            query={search.query}
            resetSearchBar={() => this.resetSearch(bucketMap[type])}
            onSubmit={this.handleSearchSubmit}
            setSearchQuery={this.handleSearchQuery}
          />,
        )}
        {renderIfHasLotsOrFilterAndSearchNotVisible(
          <LotViewHeader
            title={
              type === 'acceptedTrips' || type === 'assignedTrips' ? `${tripId} | ${tripName}` : ''
            }
            count={totalCount}
            filterCount={filterCount}
            selectedItems={selectedLots}
            multiselect={multiselect}
            listType={type}
            onCancel={this.props.resetMultiselectMode}
            handleOpenFilters={this.handleFiltersVisible}
            toggleSort={this.handleSortVisible}
            openMapView={this.handleOpenMapView}
            handleSyncAll={this.handleSyncAll}
            connectionStatus={connectionStatus}
            awaitingSyncCount={awaitingSyncCount}
          />,
        )}
        {renderIfInProgressAndOffline(<OfflineBanner />)}
        {renderDistributedTripsLotlist(
          <LotList
            // data={this.props.item.lots}
            data={filteredLots}
            // multiselect={multiselect.active}
            // selectedLots={selectedLots}
            onSelect={null}
            listType={type}
            isLoadingNextPage={isLoadingNextPage}
            // onRefresh={lotListScreenTypes.includes(this.props.type) && this.handleRefresh}
            onEndReached={lotListScreenTypes.includes(this.props.type) && this.handleLoadNextPage}
            // renderExtraView={({ dispatch_assignment_detail_id: dispatchId }) => {
            //   if (
            //     this.props.type === 'inProgress' &&
            //     this.props.inProgressCache[dispatchId] &&
            //     this.props.inProgressCache[dispatchId].isAwaitingSync
            //   ) {
            //     return <AwaitingSyncView connectionStatus={this.props.connectionStatus} />;
            //   }
            // }}
          />,
        )}
        {renderLotList(
          <LotList
            data={filteredLots}
            multiselect={multiselect.active}
            selectedLots={selectedLots}
            onSelect={this.handleOnLotSelect}
            listType={type}
            isLoadingNextPage={isLoadingNextPage}
            onRefresh={lotListScreenTypes.includes(this.props.type) && this.handleRefresh}
            onEndReached={lotListScreenTypes.includes(this.props.type) && this.handleLoadNextPage}
            renderExtraView={({ dispatch_assignment_detail_id: dispatchId }) => {
              if (
                this.props.type === 'inProgress' &&
                this.props.inProgressCache[dispatchId] &&
                this.props.inProgressCache[dispatchId].isAwaitingSync
              ) {
                return <AwaitingSyncView connectionStatus={this.props.connectionStatus} />;
              }
            }}
          />,
        )}
        {renderSectionedLotList(
          <SectionedLotList
            data={lots}
            onSelect={this.handleOnLotSelect}
            listType={type}
            onRefresh={lotListScreenTypes.includes(this.props.type) && this.handleRefresh}
          />,
        )}
        {renderIfMultiselectAssigned(
          <DistributeButtons
            role={this.props.role}
            onItemClick={this.assignLotsTo}
          />,
        )}
        {renderIfInTransitListAndCheckIn(<CheckinButtons onPress={this.handleSubmitForCheckIn} />)}
        {renderIfDefaultAssigned(
          <AcknowledgeButtonGroup
            hasIssue={this.props.hasIssue}
            onAccept={this.handleOnAcceptTrip}
            onReject={this.handleOnRejectTrip}
          />,
        )}
        <SortModal
          type={'lotlist'}
          isModalVisible={sort.isModalVisible}
          selectedItem={this.handleSelectedItem}
          cancelSort={this.handleSortVisible}
          selectedField={sort.selectedField}
        />
        <FilterModal
          applyFilter={this.applyFilter}
          bucket={this.props.type}
          selectedFilters={filters.selectedFilters}
          totalCount={filters.totalCount}
          closeFilters={this.handleFiltersVisible}
          isVisible={filters.isVisible}
          navigator={navigator}
        />
      </View>
    );
  }
}

export default LotListContainer;
