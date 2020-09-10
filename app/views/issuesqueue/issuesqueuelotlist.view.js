/**
 * @flow
 */

import type { Lot } from 'types/Lot';

import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import renderIf from 'render-if';
import { pathOr } from 'ramda';

import SearchBar from 'components/custom/SearchBar';
import IssuesLotList from './components/IssuesLotList';
import ViewHeader from './components/ViewHeader';

import { defaultNavStyles } from 'styles';
import colors from 'styles/colors';

class IssuesLotListContainer extends Component<*, *> {
  static navigatorStyle = defaultNavStyles;

  handleOnPress = (lot: Lot) => {
    this.props.navigator.push({
      screen: 'CopartTransporter.IssuesLotDetail',
      title: 'Issue Lot',
      passProps: {
        lot,
        comingFrom: this.props.listType,
        comingFromIssuesQueue: true,
      },
    });
  };

  renderLoadingIndicator = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator
        size={'large'}
        color={colors.COPART_BLUE}
      />
    </View>
  );

  render() {
    const { data, isLoading, search, isLoadingNextPage } = this.props;
    if (isLoading) {
      return this.renderLoadingIndicator();
    }
    const renderIfSearchVisibleOnAssignedList = renderIf(pathOr(false, ['visible'])(search));
    const query = pathOr('', ['query'])(search);
    return (
      <View style={{ flex: 1, backgroundColor: colors.OFF_WHITE }}>
        {renderIfSearchVisibleOnAssignedList(
          <SearchBar
            query={query}
            placeholder="Enter Lot Id"
            resetSearchBar={() => this.props.resetSearch('declined', this.props.navigator)}
            onSubmit={this.props.handleSearchQuery}
          />,
        )}
        <ViewHeader />
        <View style={{ flex: 1 }}>
          <IssuesLotList
            data={data}
            onPress={this.handleOnPress}
            isLoadingNextPage={isLoadingNextPage}
            onRefresh={this.props.onRefresh}
            onEndReached={this.props.onEndReached}
            listType={this.props.listType}
          />
        </View>
      </View>
    );
  }
}

export default IssuesLotListContainer;
