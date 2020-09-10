/**
 * @flow
 */

import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import renderIf from 'render-if';

import SearchBar from 'components/custom/SearchBar';
import DeclinedTripsList from './components/DeclinedTripsList';

import { defaultNavStyles } from 'styles';
import colors from 'styles/colors';

class TripList extends Component<*> {
  static navigatorStyle = defaultNavStyles;

  handleOnPress = (trip: Object) => {
    this.props.navigator.push({
      screen: 'CopartTransporter.DeclinedTripDetail',
      title: 'Declined Trip',
      passProps: {
        trip,
        comingFrom: this.props.listType,
      },
    });
  };

  renderLoadingIndicator = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={'large'} />
    </View>
  );

  render() {
    const { data, isLoading, search, isLoadingNextPage, role } = this.props;
    if (isLoading) {
      return this.renderLoadingIndicator();
    }
    const renderIfSearchVisibleOnAssignedList = renderIf(search ? search.visible : false);
    return (
      <View style={{ flex: 1, backgroundColor: colors.OFF_WHITE }}>
        {renderIfSearchVisibleOnAssignedList(
          <SearchBar
            query={search ? search.query : ''}
            placeholder="Enter Trip Id"
            resetSearchBar={() => this.props.resetSearch('declined', this.props.navigator)}
            onSubmit={this.props.handleSearchQuery}
          />,
        )}
        <DeclinedTripsList
          data={data}
          onPress={this.handleOnPress}
          onRefresh={this.props.onRefresh}
          onEndReached={this.props.onEndReached}
          listType={this.props.listType}
          isLoadingNextPage={isLoadingNextPage}
          role={role}
        />
      </View>
    );
  }
}

export default TripList;
