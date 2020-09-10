import React, { Component } from 'react';
import { View, FlatList, TouchableHighlight, RefreshControl } from 'react-native';
import { compose, not, equals, find, propEq } from 'ramda';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
import SearchBar from 'components/custom/SearchBar';

import Row from 'components/custom/List/ListRow';
import EmptyBucket from 'components/custom/EmptyBucket';
import { AcknowledgeButtonGroup } from 'components/core/ButtonGroup';
import TripItem from '../TripItem';
import PaginationLoader from 'components/custom/PaginationLoading';

import colors from 'styles/colors';

const gethasLotWithIssue = compose(
  not,
  equals(undefined),
  find(propEq('active_issue_flag', 'Yes')),
);

class TripList extends Component {
  static propTypes = {
    handleOnPress: PropTypes.func.isRequired,
    multiselect: PropTypes.object, // {active: bool, group: number | null}
    data: PropTypes.any.isRequired, // eslint-disable-line
    selected: PropTypes.any.isRequired, // eslint-disable-line
    renderExtraView: PropTypes.func, // eslint-disable-line
    onAccept: PropTypes.func,
    onReject: PropTypes.func,
    onRefresh: PropTypes.func,
    listType: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    refresh: PropTypes.func.isRequired,
    navigator: PropTypes.any.isRequired, // eslint-disable-line
    search: PropTypes.object, // eslint-disable-line
    resetSearch: PropTypes.func.isRequired,
    handleSearchQuery: PropTypes.func.isRequired,
    onEndReached: PropTypes.func,
    isLoadingNextPage: PropTypes.bool,
  };

  static defaultProps = {
    multiselect: false,
    onAccept: x => x,
    onReject: x => x,
    onRefresh: x => x,
  };

  renderItem = ({ item }) => {
    const {
      multiselect: { active: multiselect, group },
      selected,
      renderExtraView,
      handleOnPress,
      listType,
      action,
    } = this.props;
    const hasLotWithIssue = gethasLotWithIssue(item.lots);
    const hasActiveIssue = item.rejection_reason !== null && item.override_reason === null;
    const isAssignedAsDriver = item.vendor_personnel_id !== null;
    const itemNotDistributable = !item.distributable;
    const groupDoesNotMatchSelected = group ? group !== item.dispatch_group_id : false;
    const disabled =
      (itemNotDistributable ||
        isAssignedAsDriver ||
        hasLotWithIssue ||
        hasActiveIssue ||
        groupDoesNotMatchSelected) &&
      action === 'distribute' &&
      multiselect;
    return (
      <TouchableHighlight
        onPress={() => !disabled && handleOnPress && handleOnPress(item.tripId, item)}
        style={{
          backgroundColor: disabled ? '#ddd' : '#fff',
        }}
        disabled={disabled}
        underlayColor={'transparent'}
      >
        <Row
          chevron={!multiselect && !!handleOnPress}
          bottomBorder
          style={{ padding: 10 }}
        >
          <TripItem
            key={item.tripId}
            trip={item}
            listType={listType}
            activeIssue={hasActiveIssue}
            disabled={disabled}
            selected={selected && !!selected[item.tripId]}
            isInSelectMode={multiselect}
            renderExtraView={
              renderExtraView &&
              renderExtraView(
                disabled,
                isAssignedAsDriver,
                hasLotWithIssue,
                itemNotDistributable,
                groupDoesNotMatchSelected,
              )
            }
          />
        </Row>
      </TouchableHighlight>
    );
  };

  render() {
    const { data, action, listType, navigator, search } = this.props;
    console.log(listType);
    const extraData = {
      props: this.props,
    };
    const renderIfResponseMode = renderIf(action === 'response');
    const renderIfHasTripsAndSearchVisible = renderIf(search ? search.visible : false);
    return (
      <View style={{ flex: 1, backgroundColor: colors.OFF_WHITE }}>
        {renderIfHasTripsAndSearchVisible(
          <SearchBar
            query={search ? search.query : ''}
            placeholder="Enter Trip Id"
            resetSearchBar={() => this.props.resetSearch('distributed', this.props.navigator)}
            onSubmit={this.props.handleSearchQuery}
          />,
        )}
        <FlatList
          data={data}
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          extraData={extraData}
          keyExtractor={item => item.tripId}
          renderItem={this.renderItem}
          ListEmptyComponent={<EmptyBucket type={listType} />}
          ListFooterComponent={() => (this.props.isLoadingNextPage ? <PaginationLoader /> : null)}
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
        {renderIfResponseMode(
          <AcknowledgeButtonGroup
            onAccept={this.props.onAccept}
            onReject={this.props.onReject}
          />,
        )}
      </View>
    );
  }
}

export default TripList;
