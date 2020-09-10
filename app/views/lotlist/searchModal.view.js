// @flow

import type { Lot } from 'types/Lot';

import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import PropTypes from 'prop-types';

import SearchBar from 'components/custom/SearchBar';
import ListHeader from 'components/custom/List/ListHeader';
import FullScreenLoader from 'components/custom/FullScreenLoader';
import LotList from './components/LotList';

import { bucketMap } from './lotlist.helper';

import { defaultNavStyles } from 'styles';
import { getLotTripTypeInfo } from 'constants/tripTypeMap';
import icons from 'constants/icons';

import { resetSearch, setSearchQuery, getMoreSearchResults } from './lotlist.action';
import { lotList as defaultLotList } from './lotlist.constants';

type SearchModalProps = {
  query: string,
  data: Object, // lot list item type
  setSearchQuery: (query: string, bucket: string, navigator: Object) => any,
  resetSearch: (bucket: string, navigator: Object) => any,
};

class SearchModal extends Component<SearchModalProps> {
  static navigatorStyle = defaultNavStyles;
  static navigatorButtons = {
    leftButtons: [
      {
        icon: icons.tripsScreen.tripIconClose,
        id: 'closeModal',
      },
    ],
  };
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }
  componentWillMount() {
    const { query } = this.props;
    this.props.setSearchQuery(query, bucketMap[this.listType], this.props.navigator);
  }
  onNavigatorEvent = (event) => {
    if (event.id === 'closeModal') {
      this.props.navigator.dismissModal();
    }
  };
  listType = 'globalSearch';
  handleSearchSubmit = (query: string) => {
    this.props.setSearchQuery(query, bucketMap[this.listType], this.props.navigator);
  };
  handleSelectLot = (lotNumber: number, lot: Lot) => {
    this.props.navigator.push({
      screen: 'CopartTransporter.LotView',
      title: getLotTripTypeInfo(lot).lotViewTitle,
      passProps: {
        lotNumber,
        lot,
        lotBucket: 'globalSearch',
        comingFromTripList: 'globalSearch',
      },
    });
  };
  handleRefresh = () => {};
  handleLoadNextPage = () => {
    const { search, page } = this.props.data;
    const nextPage = page + 1;
    this.props.getMoreSearchResults(search.query, this.props.navigator, nextPage);
  };
  handleReset = () => {
    this.props.resetSearch(bucketMap[this.listType], navigator);
    this.props.navigator.dismissModal();
  };
  render() {
    const { lots, search, isLoading, isLoadingNextPage, count } = this.props.data;
    const totalCount = count || (lots && lots.length) || 0;

    const { query } = search;
    return (
      <View style={{ flex: 1 }}>
        <SearchBar
          query={query}
          resetSearchBar={this.handleReset}
          onSubmit={this.handleSearchSubmit}
        />
        <ListHeader
          title={''}
          subtitle={`${totalCount} Lots`}
          actions={[]}
        />
        {isLoading ? (
          <FullScreenLoader />
        ) : (
          <LotList
            data={lots}
            onSelect={this.handleSelectLot}
            listType={this.listType}
            isLoadingNextPage={isLoadingNextPage}
            onRefresh={this.handleRefresh}
            onEndReached={this.handleLoadNextPage}
          />
        )}
      </View>
    );
  }
}

SearchModal.propTypes = {};

const mapStateToProps = state => ({
  data: pathOr(defaultLotList, ['lotlist', 'globalSearch'])(state),
});

const mapDispatchToProps = {
  resetSearch,
  setSearchQuery,
  getMoreSearchResults,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchModal);
