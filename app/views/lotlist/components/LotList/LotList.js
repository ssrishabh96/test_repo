// @flow

import type { Lot } from 'types/Lot';
import { Props } from './types';

import React, { Component } from 'react';
import {
  FlatList,
  TouchableHighlight,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import renderIf from 'render-if';

import LotItem from '../LotItem';
import Row from 'components/custom/List/ListRow';
import EmptyBucket from 'components/custom/EmptyBucket';
import SearchBar from 'components/custom/SearchBar';
import PaginationLoader from 'components/custom/PaginationLoading';

import colors from 'styles/colors';

export default class LotList extends Component<Props> {
  renderItem = ({ item }: Object) => {
    const { multiselect, selectedLots, listType, renderExtraView, onSelect } = this.props;

    const disabled =
      (listType !== 'issueLots' || listType !== 'distributedTrips') &&
      item.active_issue_flag === 'Yes' &&
      multiselect &&
      !onSelect;
    const showChevron = !disabled && !multiselect && onSelect;
    return (
      <TouchableHighlight
        onPress={() => !disabled && onSelect && onSelect(item.number, item)}
        style={{
          backgroundColor: disabled ? '#ddd' : '#fff',
        }}
        underlayColor={'transparent'}
        disabled={disabled}
      >
        <Row
          chevron={showChevron}
          bottomBorder
          style={{ paddingVertical: 10, paddingLeft: 10 }}
        >
          <LotItem
            key={item.dispatch_assignment_detail_id}
            lot={item}
            hasIssue={item.active_issue_flag === 'Yes'}
            listType={listType}
            selected={selectedLots && selectedLots[item.dispatch_assignment_detail_id]}
            multiselect={multiselect}
            renderExtraView={renderExtraView}
          />
        </Row>
      </TouchableHighlight>
    );
  };

  render() {
    const { data, listType, isLoading = false, search } = this.props;
    const extraData = {
      props: this.props,
    };
    const renderIfHasTripsAndSearchVisible = renderIf(search ? search.visible : false);
    if (isLoading || !data) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: colors.OFF_WHITE }}>
        {renderIfHasTripsAndSearchVisible(
          <SearchBar
            query={search ? search.query : ''}
            placeholder="Enter Lot Number"
            resetSearchBar={this.props.resetSearch}
            onSubmit={this.props.handleSearchQuery}
          />,
        )}
        <FlatList
          ref={(ref: any) => {
            this.flatListRef = ref;
          }}
          data={data}
          extraData={extraData}
          keyExtractor={(item: Lot) => item.number}
          renderItem={this.renderItem}
          ListEmptyComponent={<EmptyBucket type={listType} />}
          ListFooterComponent={() => (this.props.isLoadingNextPage ? <PaginationLoader /> : null)}
          onEndReached={this.props.onEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            this.props.onRefresh && (
              <RefreshControl
                refreshing={false}
                onRefresh={this.props.onRefresh}
              />
            )
          }
        />
      </View>
    );
  }
}
