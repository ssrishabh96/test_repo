// @flow

import type { Trip } from 'types/Trip';

import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
  TouchableHighlight,
  RefreshControl,
  FlatList,
} from 'react-native';

import Row from 'components/custom/List/ListRow';
import DeclinedTripsListItem from '../DeclinedTripsListItem';
import EmptyBucket from 'components/custom/EmptyBucket';
import PaginationLoader from 'components/custom/PaginationLoading';

import { ItemSeparatorView } from 'styles';

type Props = {
  data: Array<Trip>, // TODO: Create proper type for DeclinedTrip
  onPress: (item: Trip) => void,
  isLoading: boolean,
  isLoadingNextPage: boolean,
  listType: 'raised' | 'assigned',
  onEndReached: ({ distanceToEnd: number }) => void,
  onRefresh: () => void,
  role: number,
};

class DeclinedTripsList extends Component<Props> {
  // eslint-disable-next-line
  renderItem = ({ item }: { item: Trip }) => (
    <TouchableHighlight
      onPress={() => this.props.onPress(item)}
      underlayColor={'transparent'}
    >
      <Row
        chevron
        style={{ padding: 10 }}
      >
        <DeclinedTripsListItem
          key={item.trip_auto_id}
          trip={item}
          listType={this.props.listType}
          role={this.props.role}
        />
      </Row>
    </TouchableHighlight>
  );

  render() {
    const { data, isLoading } = this.props;
    const extraData = {
      props: this.props,
    };

    if (!data || isLoading) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size={'large'} />
        </View>
      );
    }

    return (
      <FlatList
        data={data}
        extraData={extraData}
        renderItem={this.renderItem}
        ItemSeparatorComponent={() => <ItemSeparatorView />}
        ListEmptyComponent={<EmptyBucket type="declinedTrips" />}
        ListFooterComponent={() => (this.props.isLoadingNextPage ? <PaginationLoader /> : null)}
        keyExtractor={(item: Trip) => item.tripId.toString()}
        // $FlowFixMe
        onEndReached={this.props.onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          typeof this.props.onRefresh === 'function' && (
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                this.props.onRefresh();
              }}
            />
          )
        }
      />
    );
  }
}

export default DeclinedTripsList;
