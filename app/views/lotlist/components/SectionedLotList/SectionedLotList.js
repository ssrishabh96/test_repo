// @flow

import React, { Component } from 'react';
import { SectionList, TouchableOpacity, View, Text, RefreshControl } from 'react-native';
import EmptyBucket from 'components/custom/EmptyBucket';
import colors from 'styles/colors';

import Row from 'components/custom/List/ListRow';
import LotItem from '../LotItem';
import { Props, LotListSectionItem } from './types';
import { LotItemType } from '../LotItem/types';

export default class SectionedLotList extends Component<Props> {
  renderItem = ({ item }: LotItemType) => (
    <TouchableOpacity onPress={() => this.props.onSelect(item.number, item)}>
      <Row
        chevron
        bottomBorder
        style={{ padding: 10 }}
      >
        <LotItem
          key={item.number}
          lot={item}
          hasIssue={item.active_issue_flag === 'Yes'}
          showPartialVerified
          selected={this.props.selectedLots && this.props.selectedLots[item.number]}
          multiselect={this.props.multiselect}
        />
      </Row>
    </TouchableOpacity>
  );
  renderSectionHeader = ({ section }: LotListSectionItem) => (
    <View style={{ height: 30, backgroundColor: colors.GRAY_DARK, justifyContent: 'center' }}>
      <Text
        style={{ marginHorizontal: 10, fontWeight: 'bold', fontSize: 16, color: 'white' }}
      >{`Completed on ${section.key}`}</Text>
    </View>
  );

  render() {
    const { data } = this.props;
    const extraData = {
      props: this.props,
    };
    if (!data) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
    return (
      <SectionList
        contentContainerStyle={{ marginBottom: 20 }}
        sections={data}
        // extraData={extraData}
        // keyExtractor={(item: LotItemType) => item.number}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        ListEmptyComponent={<EmptyBucket type="completedLots" />}
        refreshControl={
          this.props.onRefresh && (
            <RefreshControl
              refreshing={false}
              onRefresh={this.props.onRefresh}
            />
          )
        }
      />
    );
  }
}
