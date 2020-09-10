// @flow
/* eslint-disable no-alert */

import type { NavigationState as TabViewNavState } from 'react-native-tab-view/src/TabViewTypeDefinitions';

import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { TabViewAnimated, TabBar, TabViewPagerPan } from 'react-native-tab-view';
import { connect } from 'react-redux';
import renderIf from 'render-if';
import { isEmpty } from 'ramda';

import {
  fetchDeclinedTripList,
  fetchAssignedDeclinedTrips,
  fetchRaisedByMeDeclinedTrips,
  setSearchQuery,
  showSearch,
  resetSearch,
  hideSearch,
} from './declinedtriplist.actions';
import { declinedTripsListSelector } from './declinedtriplist.redux';
import { getUserRole } from 'views/login/login.redux';
import { DRIVER as DRIVER_ROLE } from 'constants/user/roles';

import DeclinedTripList from './declinedtriplist.view';

import { defaultNavStyles } from 'styles';
import styles, { Badge, TextCount, TabContainer, TabLabel } from './declinedtriplist.styles';
import colors from 'styles/colors';
import icons from 'constants/icons';
import Locale from 'utils/locale';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

type State = {
  // $FlowFixMe
  navState: TabViewNavState, // TODO: Add type argument
  isSearchVisible: {
    raisedByMe: boolean,
    assignedToMe: boolean,
  },
};

class DeclinedTripsContainer extends Component<*, State> {
  static navigatorStyle = defaultNavStyles;

  static navigatorButtons = {
    rightButtons: [
      {
        id: 'search',
        icon: icons.tripsScreen.tripIconSearch,
      },
    ],
  };

  constructor(props: any) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  state = {
    navState: {
      index: 0,
      routes: [
        { key: 'raised', title: Locale.translate('tabView.issue.reportedByMe') },
        { key: 'assigned', title: Locale.translate('tabView.issue.assignedToMe') },
      ],
    },
    isSearchVisible: {
      raisedByMe: false,
      assignedToMe: false,
    },
  };

  componentDidMount() {
    if (this.props.role === DRIVER_ROLE) {
      // only fetch raised by me declined trips
      this.props.fetchRaisedByMeDeclinedTrips(this.props.navigator);
    } else {
      this.props.fetchDeclinedTripList(this.props.navigator);
    }
  }

  onNavigatorEvent = (event: Object) => {
    const currentIndex = this.state.navState.index;
    switch (event.id) {
      case 'search': {
        if (currentIndex === 0 || this.props.role === DRIVER_ROLE) {
          this.props.showSearch('raisedByMe');
        } else if (currentIndex === 1) {
          this.props.showSearch('assignedToMe');
        }
        break;
      }
      default:
        console.log('unhandled event', event.id); // eslint-disable-line
    }
  };

  setSearchBarConfig = () => {
    const { isSearchVisible: { raisedByMe, assignedToMe }, navState } = this.state;
    const currentIndex = navState.index;
    this.setState({
      isSearchVisible: {
        raisedByMe: currentIndex === 0 ? !raisedByMe : raisedByMe,
        assignedToMe: currentIndex === 1 ? !assignedToMe : assignedToMe,
      },
    });
  };

  handleIndexChange = (index: number) => {
    this.setState((currentState: Object) => ({
      navState: {
        ...currentState.navState,
        index,
      },
    }));
  };

  handleSearchQuery = (query: string, listType: string) => {
    this.props.setSearchQuery(query, listType, this.props.navigator);
  };

  handleLoadNextRaisedPage = () => {
    if (!this.props.isLoadingNextPage.raisedByMe) {
      this.props.fetchRaisedByMeDeclinedTrips(this.props.navigator, this.props.page.raisedByMe + 1);
    }
  };
  handleLoadNextAssignedPage = () => {
    if (!this.props.isLoadingNextPage.assignedToMe) {
      this.props.fetchAssignedDeclinedTrips(this.props.navigator, this.props.page.assignedToMe + 1);
    }
  };

  resetSearch = (listType: string) => {
    const { searchResults, navigator } = this.props;
    if (isEmpty(searchResults[listType].search.query)) {
      this.props.hideSearch(listType);
    } else this.props.resetSearch(listType, navigator);
  };

  renderHeader = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
      renderLabel={(data: Object) => (
        <TabContainer focused={data.focused}>
          <TabLabel focused={data.focused}>{data.route.title}</TabLabel>
          <Badge
            focused={data.focused}
            routeKey={data.route.key}
          >
            <TextCount>
              {data.route.key === 'raised'
                ? this.props.totalCount.raisedByMe
                : this.props.totalCount.assignedToMe}
            </TextCount>
          </Badge>
        </TabContainer>
      )}
    />
  );

  renderScene = ({ route }: Object) => {
    const { searchResults, role } = this.props;
    const resetSearchForRaisedTab = () =>
      this.props.resetSearch('raisedByMe', this.props.navigator);
    const resetSearchForAssignedTab = () =>
      this.props.resetSearch('assignedToMe', this.props.navigator);
    switch (route.key) {
      case 'raised':
        return (
          <View style={{ flex: 1 }}>
            <DeclinedTripList
              data={this.props.raisedByMe}
              isLoading={this.props.isLoading.raisedByMe}
              navigator={this.props.navigator}
              onRefresh={() => this.props.fetchRaisedByMeDeclinedTrips(this.props.navigator)}
              onEndReached={this.handleLoadNextRaisedPage}
              listType="raised"
              role={role}
              isLoadingNextPage={this.props.isLoadingNextPage.raisedByMe}
              search={searchResults.raisedByMe.search}
              resetSearch={() => this.resetSearch('raisedByMe')}
              handleSearchQuery={(query: string) => this.handleSearchQuery(query, 'raisedByMe')}
            />
          </View>
        );
      case 'assigned':
        return (
          <View style={{ flex: 1 }}>
            <DeclinedTripList
              data={this.props.assignedToMe}
              isLoading={this.props.isLoading.assignedToMe}
              isLoadingNextPage={this.props.isLoadingNextPage.assignedToMe}
              navigator={this.props.navigator}
              onRefresh={() => this.props.fetchAssignedDeclinedTrips(this.props.navigator)}
              onEndReached={this.handleLoadNextAssignedPage}
              listType="assigned"
              search={searchResults.assignedToMe.search}
              resetSearch={() => this.resetSearch('assignedToMe')}
              handleSearchQuery={(query: string) => this.handleSearchQuery(query, 'assignedToMe')}
            />
          </View>
        );
      default:
        return null;
    }
  };

  renderPager = (props: any) => <TabViewPagerPan {...props} />;

  render() {
    const { searchResults } = this.props;
    console.info('Props-->', this.props, searchResults.raisedByMe.search);
    const resetSearchForRaisedTab = () => this.props.resetSearch('raised', this.props.navigator);
    const renderIfDriverRole = renderIf(this.props.role === DRIVER_ROLE);
    const renderIfOtherRoles = renderIf(this.props.role !== DRIVER_ROLE);
    return (
      <View style={{ flex: 1 }}>
        {renderIfOtherRoles(
          <TabViewAnimated
            style={{ flex: 1 }}
            initialLayout={initialLayout}
            navigationState={this.state.navState}
            onIndexChange={this.handleIndexChange}
            renderHeader={this.renderHeader}
            renderPager={this.renderPager}
            renderScene={this.renderScene}
          />,
        )}
        {renderIfDriverRole(
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 50,
                padding: 10,
                backgroundColor: colors.DARK_RED,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>
                {Locale.translate('tabView.issue.reportedByMe')}
              </Text>
              <Badge
                style={{ backgroundColor: '#fff', right: 105 }}
                focused
                routeKey={'raised'}
              >
                <TextCount style={{ color: '#444' }}>{this.props.totalCount.raisedByMe}</TextCount>
              </Badge>
            </View>
            <View style={{ flex: 1 }}>
              <DeclinedTripList
                data={this.props.raisedByMe}
                isLoading={this.props.isLoading.raisedByMe}
                isLoadingNextPage={this.props.isLoadingNextPage.raisedByMe}
                navigator={this.props.navigator}
                listType="raised"
                onRefresh={() => this.props.fetchRaisedByMeDeclinedTrips(this.props.navigator)}
                onEndReached={this.handleLoadNextRaisedPage}
                search={searchResults.raisedByMe.search}
                resetSearch={resetSearchForRaisedTab}
                handleSearchQuery={(query: string) => this.handleSearchQuery(query, 'raisedByMe')}
              />
            </View>
          </View>,
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: Object): Object => ({
  ...declinedTripsListSelector(state),
  role: getUserRole(state),
});

const mapDispatchToProps = {
  fetchDeclinedTripList,
  fetchRaisedByMeDeclinedTrips,
  fetchAssignedDeclinedTrips,
  setSearchQuery,
  showSearch,
  resetSearch,
  hideSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeclinedTripsContainer);
