// @flow

import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
  TouchableHighlight,
  RefreshControl,
  FlatList,
} from 'react-native';

import Row from 'components/custom/List/ListRow';
import IssuesLotListItem from '../IssuesLotListItem';
import EmptyBucket from 'components/custom/EmptyBucket';

import { ItemSeparatorView } from 'styles';
import colors from 'styles/colors';
import PaginationLoader from 'components/custom/PaginationLoading';

class IssuesLotList extends Component<*> {
  renderItem = ({ item }: any) => (
    <TouchableHighlight
      onPress={() => this.props.onPress(item)}
      underlayColor={'transparent'}
    >
      <Row
        chevron
        containerStyle={{
          padding: 10,
          backgroundColor: colors.WHITE,
        }}
      >
        <IssuesLotListItem
          key={item.dispatchAssignmentDetailId}
          lot={item}
          listType={this.props.listType}
        />
      </Row>
    </TouchableHighlight>
  );

  renderLoadingIndicator = () => (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size={'large'} />
    </View>
  );

  render() {
    const { data, isLoading } = this.props;
    const extraData = {
      props: this.props,
    };

    if (!data || isLoading) {
      return this.renderLoadingIndicator();
    }

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.OFF_WHITE,
        }}
      >
        <FlatList
          data={data}
          extraData={extraData}
          renderItem={this.renderItem}
          ItemSeparatorComponent={() => <ItemSeparatorView />}
          ListEmptyComponent={<EmptyBucket type={'issueLots'} />}
          ListFooterComponent={() => (this.props.isLoadingNextPage ? <PaginationLoader /> : null)}
          keyExtractor={(item: any) => item.number}
          onEndReached={this.props.onEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            this.props.onRefresh && (
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  this.props.onRefresh();
                }}
              />
            )
          }
        />
      </View>
    );
  }
}

export default IssuesLotList;
