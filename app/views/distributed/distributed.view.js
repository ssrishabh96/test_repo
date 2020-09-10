// @flow

import type { Lot } from 'types/Lot';
import type { Trip } from 'types/Trip';
import type { RNNNavigator } from 'types/RNNavigation';
import type { NavigationState as TabViewNavState } from 'react-native-tab-view/src/TabViewTypeDefinitions';

import React from 'react';
import { Dimensions, View } from 'react-native';
import { TabViewAnimated } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { isEmpty } from 'ramda';

import {
  getDistributedTrips,
  setSearchQuery as setSearchQueryForTripList,
  resetSearch as resetSearchForTripList,
  showSearch as showSearchForTripList,
  hideSearch as hideSearchForTripList,
} from 'views/trips/trips.actions';
import {
  getDistributedLots,
  setSearchQuery as setSearchQueryForLotList,
  resetSearch as resetSearchForLotList,
  showSearch as showSearchForLotList,
  hideSearch as hideSearchForLotList,
} from 'views/lotlist/lotlist.action';

import TripList from 'views/trips/components/TripList';
import LotList from 'views/lotlist/components/LotList';
import TabBarHeader from './components/TabBarHeader';
import AssignedTo from './components/AssignedTo';
import FullScreenLoadingIndicator from 'components/custom/FullScreenLoader';

// import { getNavBarRightButtons } from 'config/UserManager';
import icons from 'constants/icons';
import { defaultNavStyles } from 'styles';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const TripStatusMap = {
  R: 'rejected',
  // ""
};

type Props = {
  +getDistributedTrips: () => any,
  +getDistributedLots: () => any,
  +resetSearchForTripList: () => any,
  +setSearchQueryForTripList: () => any,
  +showSearchForTripList: () => any,
  +setSearchQueryForLotList: () => any,
  +resetSearchForLotList: () => any,
  +showSearchForLotList: () => any,
  +hideSearchForTripList: () => any,
  +hideSearchForLotList: () => any,
  +trips: Array<Trip>,
  +tripsLoading: boolean,
  +lots: Array<Lot>,
  +lotsLoading: boolean,
  +navigator: Function,
  +tripSearch: Object,
  +lotSearch: Object,
  +navigator: RNNNavigator,
};

// $FlowFixMe
type State = TabViewNavState;

class Distributed extends React.Component<Props, State> {
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
    const { navigator } = this.props;
    navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  state = {
    index: 0,
    routes: [{ key: 'trips', title: 'Trips' }, { key: 'lots', title: 'Lots' }],
  };

  componentWillMount() {
    this.props.getDistributedTrips(this.props.navigator);
    this.props.getDistributedLots(this.props.navigator);
  }
  onNavigatorEvent(event) {
    const { index } = this.state;
    switch (event.id) {
      case 'search':
        if (index === 0) {
          this.props.showSearchForTripList('distributed');
        } else if (index === 1) {
          this.props.showSearchForLotList('distributed');
        }
        break;
      case 'didDisappear':
        this.props.resetSearchForTripList('distributed', this.props.navigator);
        this.props.resetSearchForLotList('distributed', this.props.navigator);
        break;
      default:
        console.log('unhandled event', event.id); // eslint-disable-line
    }
  }

  handleIndexChange = (index: number) => {
    if (index !== this.state.index) this.setState({ index });
    if (this.state.index === 0) {
      this.tripslistRef &&
        this.tripslistRef.flatListRef &&
        this.tripslistRef.flatListRef.scrollToOffset &&
        this.tripslistRef.flatListRef.scrollToOffset({
          x: 0,
          y: 0,
          animated: true,
        });
    } else {
      this.lotslistRef &&
        this.lotslistRef.flatListRef &&
        this.lotslistRef.flatListRef.scrollToOffset &&
        this.lotslistRef.flatListRef.scrollToOffset({
          x: 0,
          y: 0,
          animated: true,
        });
    }
  };

  handleSearchQuery = (query: string) => {
    this.props.setSearchQueryForTripList(query, 'distributed', this.props.navigator);
  };

  handleSearchQueryForLotList = (query: string) => {
    this.props.setSearchQueryForLotList(query, 'distributed', this.props.navigator);
  };

  handleLoadNextLotPage = () => {
    if (!this.props.lotsLoadingNextPage) {
      this.props.getDistributedLots(this.props.navigator, this.props.lotsPage + 1);
    }
  };
  handleLoadNextTripPage = () => {
    if (!this.props.tripsLoadingNextPage) {
      this.props.getDistributedTrips(this.props.navigator, this.props.tripsPage + 1);
    }
  };
  handleShowLotList = (tripId, trip) => {
    // const isAssignedAsDriver = trip.vendor_personnel_id !== null;
    this.props.navigator.push({
      screen: 'CopartTransporter.LotList',
      title: `TRIP - ${tripId || 'N/A'} - Lots`,
      passProps: {
        tripId,
        tripName: trip.tripName,
        tripStatus: 'distributed', // TripStatusMap[trip.trip_status],
        type: 'distributedTrips',
        item: trip,
      },
      animated: false,
      navigatorStyle: defaultNavStyles,
    });
  };

  resetSearch = (type: string) => {
    const { tripSearch, lotSearch } = this.props;
    switch (type) {
      case 'trips':
        if (isEmpty(tripSearch.query)) {
          this.props.hideSearchForTripList('distributed');
        } else this.props.resetSearchForTripList('distributed', this.props.navigator);
        break;
      case 'lots':
        if (isEmpty(lotSearch.query)) {
          this.props.hideSearchForLotList('distributed');
        } else this.props.resetSearchForLotList('distributed', this.props.navigator);
        break;
      default:
        break;
    }
  };

  renderScene = ({ route }: Object) => {
    const { tripSearch, lotSearch } = this.props;
    switch (route.key) {
      case 'trips':
        if (this.props.tripsLoading) return <FullScreenLoadingIndicator isLoading />;
        return (
          <View style={{ flex: 1 }}>
            <TripList
              handleOnPress={this.handleShowLotList}
              data={this.props.trips}
              search={tripSearch}
              resetSearch={() => this.resetSearch('trips')}
              onRefresh={() => this.props.getDistributedTrips(this.props.navigator)}
              handleSearchQuery={this.handleSearchQuery}
              ref={(ref: any) => {
                this.tripslistRef = ref;
              }}
              isLoadingNextPage={this.props.tripsLoadingNextPage}
              onEndReached={this.handleLoadNextTripPage}
              listType={'distributedTrips'}
              renderExtraView={() => (item: Object) => (
                <AssignedTo
                  name={item.responsible_party_name}
                  status={item.status}
                  type={'trip'}
                />
              )}
            />
          </View>
        );
      case 'lots':
        if (this.props.lotsLoading) return <FullScreenLoadingIndicator isLoading />;
        return (
          <View style={{ flex: 1 }}>
            <LotList
              data={this.props.lots}
              search={lotSearch}
              resetSearch={() => this.resetSearch('lots')}
              onRefresh={() => this.props.getDistributedLots(this.props.navigator)}
              handleSearchQuery={this.handleSearchQueryForLotList}
              ref={(ref: any) => {
                this.lotslistRef = ref;
              }}
              isLoadingNextPage={this.props.lotsLoadingNextPage}
              onEndReached={this.handleLoadNextLotPage}
              listType={'distributedLots'}
              renderExtraView={(item: Object) => (
                <AssignedTo
                  name={item.responsible_party_name}
                  status={item.lotStatus}
                  type={'lot'}
                />
              )}
            />
          </View>
        );
      default:
        return null;
    }
  };

  renderHeader = (props: Object) => (
    <TabBarHeader
      props={props}
      tripCount={this.props.tripTotalCount}
      lotCount={this.props.lotsTotalCount}
    />
  );

  render() {
    console.warn('Props-->', this.props);
    return (
      <TabViewAnimated
        navigationState={this.state}
        renderScene={this.renderScene}
        renderHeader={this.renderHeader}
        onIndexChange={this.handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}

const mapDispatchToProps = {
  getDistributedTrips,
  getDistributedLots,
  setSearchQueryForTripList,
  resetSearchForTripList,
  showSearchForTripList,
  setSearchQueryForLotList,
  resetSearchForLotList,
  showSearchForLotList,
  hideSearchForLotList,
  hideSearchForTripList,
};

const mapStateToProps = (state: Object) => ({
  trips: state.trips.distributed.trips,
  tripsLoading: state.trips.distributed.isLoading,
  tripsLoadingNextPage: state.trips.distributed.isLoadingNextPage,
  tripsPage: state.trips.distributed.page,
  tripSearch: state.trips.distributed.search,
  tripTotalCount: state.trips.distributed.count,
  lotSearch: state.lotlist.distributed.search,
  lots: state.lotlist.distributed.lots,
  lotsLoading: state.lotlist.distributed.isLoading,
  lotsLoadingNextPage: state.lotlist.distributed.isLoadingNextPage,
  lotsPage: state.lotlist.distributed.page,
  lotsTotalCount: state.lotlist.distributed.count,
});

export default connect(mapStateToProps, mapDispatchToProps)(Distributed);
