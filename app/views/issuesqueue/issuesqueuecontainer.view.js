/**
 * @flow
 */

import { Lot } from 'types/Lot';

import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { TabViewAnimated, TabBar, TabViewPagerPan } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { isEmpty } from 'ramda';
import renderIf from 'render-if';

import {
  fetchIssuesQueue,
  fetchAssignedIssuesQueue,
  fetchRaisedByMeIssuesQueue,
  fetchPartialTrips,
  setSearchQuery,
  showSearch,
  resetSearch,
  hideSearch,
} from './issuesqueue.action';
import { issuesLotListSelector } from './issuesqueue.redux';

import IssuesLotListContainer from './issuesqueuelotlist.view';
import LotList from 'views/lotlist/components/LotList';

import { defaultNavStyles } from 'styles';
import styles, { Badge, TextCount, TabContainer, TabLabel } from './issuesqueue.style';
import icons from 'constants/icons';
import colors from 'styles/colors';
import Locale from 'utils/locale';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

class IssuesQueueContainer extends Component<*, *> {
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
    index: 0,
    routes: [
      { key: 'raised', title: Locale.translate('tabView.issue.reportedByMe') },
      { key: 'assigned', title: Locale.translate('tabView.issue.assignedToMe') },
      { key: 'partialTripLots', title: Locale.translate('tabView.issue.partialTrips') },
    ],
  };

  componentDidMount() {
    this.props.fetchIssuesQueue(this.props.navigator);
  }

  onNavigatorEvent = (event: Object) => {
    const { index } = this.state;
    switch (event.id) {
      case 'search': {
        if (index === 0) {
          this.props.showSearch('raisedByMe');
        } else if (index === 1) {
          this.props.showSearch('assignedToMe');
        } else if (index === 2) {
          this.props.showSearch('issueLots');
        }
        break;
      }
      default:
        console.log('unhandled event', event.id); // eslint-disable-line
    }
  };

  getCount = (key: string) => {
    switch (key) {
      case 'raised':
        return this.props.totalCount.raisedByMe || 0;
      case 'assigned':
        return this.props.totalCount.assignedToMe || 0;
      case 'partialTripLots':
        return this.props.totalCount.issueLots || 0;
      default:
        return 0;
    }
  };

  handleIndexChange = (index: number) => {
    this.setState({ index });
  };

  handlePartialLotItemPress = (lotNumber: number, lot: Lot) => {
    this.props.navigator.push({
      screen: 'CopartTransporter.IssuesLotDetail',
      title: 'Issue Lot',
      passProps: {
        lot: { ...lot, messageTypeDescription: 'Partial Completed Trip' },
        comingFrom: this.props.listType,
      },
    });
  };

  handleSearchQuery = (query: string, listType: string) => {
    this.props.setSearchQuery(query, listType, this.props.navigator);
  };
  handleLoadNextAssignedPage = () => {
    if (!this.props.isLoadingNextPage.assignedToMe) {
      this.props.fetchAssignedIssuesQueue(this.props.navigator, this.props.page.assignedToMe + 1);
    }
  };
  handleLoadNextRaisedPage = () => {
    if (!this.props.isLoadingNextPage.raisedByMe) {
      this.props.fetchRaisedByMeIssuesQueue(this.props.navigator, this.props.page.raisedByMe + 1);
    }
  };
  handleLoadNextPartialPage = () => {
    if (!this.props.isLoadingNextPage.issueLots) {
      this.props.fetchPartialTrips(this.props.navigator, this.props.page.issueLots + 1);
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
      style={[styles.tabbar, { backgroundColor: colors.GRAY_LIGHT }]}
      tabStyle={styles.tab}
      labelStyle={styles.label}
      scrollEnabled
      renderLabel={(data: Object) => (
        <TabContainer focused={data.focused}>
          <TabLabel
            multiline
            focused={data.focused}
          >
            {data.route.title}
          </TabLabel>
          <Badge
            focused={data.focused}
            routeKey={data.route.key}
          >
            <TextCount>{this.getCount(data.route.key)}</TextCount>
          </Badge>
        </TabContainer>
      )}
    />
  );

  renderScene = ({ route }: Object) => {
    const { searchResults, navigator } = this.props;
    switch (route.key) {
      case 'raised': {
        return (
          <IssuesLotListContainer
            data={this.props.raisedByMe}
            navigator={navigator}
            listType="raised"
            isLoading={this.props.isLoading.raisedByMe}
            isLoadingNextPage={this.props.isLoadingNextPage.raisedByMe}
            onRefresh={() => this.props.fetchRaisedByMeIssuesQueue(navigator)}
            onEndReached={this.handleLoadNextRaisedPage}
            search={searchResults.raisedByMe.search}
            resetSearch={() => this.resetSearch('raisedByMe')}
            handleSearchQuery={(query: string) => this.handleSearchQuery(query, 'raisedByMe')}
          />
        );
      }
      case 'assigned':
        return (
          <IssuesLotListContainer
            data={this.props.assignedToMe}
            navigator={navigator}
            listType="assigned"
            isLoading={this.props.isLoading.assignedToMe}
            isLoadingNextPage={this.props.isLoadingNextPage.assignedToMe}
            onRefresh={() => this.props.fetchAssignedIssuesQueue(navigator)}
            onEndReached={this.handleLoadNextAssignedPage}
            search={searchResults.assignedToMe.search}
            resetSearch={() => this.resetSearch('assignedToMe')}
            handleSearchQuery={(query: string) => this.handleSearchQuery(query, 'assignedToMe')}
          />
        );
      case 'partialTripLots':
        return (
          <View style={{ flex: 1 }}>
            <LotList
              data={this.props.partialTripLots}
              onSelect={this.handlePartialLotItemPress}
              isLoading={this.props.isLoading.issueLots}
              isLoadingNextPage={this.props.isLoadingNextPage.issueLots}
              listType="issueLots"
              onRefresh={() => this.props.fetchPartialTrips(navigator)}
              onEndReached={this.handleLoadNextPartialPage}
              search={searchResults.issueLots.search}
              resetSearch={() => this.resetSearch('issueLots')}
              handleSearchQuery={(query: string) => this.handleSearchQuery(query, 'issueLots')}
            />
          </View>
        );
      default:
        return null;
    }
  };

  renderPager = (props: any) => <TabViewPagerPan {...props} />;

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TabViewAnimated
          style={{ flex: 1 }}
          initialLayout={initialLayout}
          navigationState={this.state}
          onIndexChange={this.handleIndexChange}
          renderHeader={this.renderHeader}
          renderPager={this.renderPager}
          renderScene={this.renderScene}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: Object): Object => ({
  ...issuesLotListSelector(state),
});

const mapDispatchToProps = {
  fetchRaisedByMeIssuesQueue,
  fetchAssignedIssuesQueue,
  fetchPartialTrips,
  fetchIssuesQueue,
  setSearchQuery,
  showSearch,
  resetSearch,
  hideSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(IssuesQueueContainer);
