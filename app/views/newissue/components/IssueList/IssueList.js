// @flow

import { Props } from './types'; // IssueTypeRowProp

import React, { Component } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';

import IssueItem from '../IssueItem';

import { ItemSeparatorView } from './style';

class IssueList extends Component<Props> {
  renderItem = ({ item }: any) => (
    <TouchableHighlight
      style={{
        backgroundColor: '#fff',
        minHeight: 45,
      }}
      onPress={() => this.props.onIssueItemPressed(item, this.props.otherIssueText)}
      underlayColor={'transparent'}
    >
      <IssueItem
        key={item.code}
        item={item}
        isSubIssueView={this.props.isSubIssueView}
        checked={this.props.isSubIssueView ? this.props.checkedIssueId === item.code : false}
      />
    </TouchableHighlight>
  );

  render() {
    const {
      data,
      isSubIssueView,
      // showTextBox,
      otherIssueText,
      tripRejectionReason,
      onChangeOtherIssueText,
      onChangeTripRejectReason,
      checkedIssueId,
      entity,
    } = this.props;
    const extraData = {
      props: this.props,
    };

    if (!data) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size={'large'} />
        </View>
      );
    }

    return (
      <ScrollView>
        <FlatList
          scrollEnabled={false}
          data={data}
          extraData={extraData}
          renderItem={this.renderItem}
          ItemSeparatorComponent={() => <ItemSeparatorView />}
          keyExtractor={(item: any) => item.code}
        />
        <KeyboardAvoidingView behavior="padding">
          {entity === 'lot' /* checkedIssueId === 'other' && */ &&
            /* || showTextBox */
            isSubIssueView && (
              <View style={{ padding: 20 }}>
                <TextInput
                  multiline
                  numberOfLines={4}
                  placeholder={
                    checkedIssueId === 'other'
                      ? 'Explain the issue briefly...(Required*)'
                      : 'Optional: Explain issue briefly'
                  }
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  onChangeText={onChangeOtherIssueText}
                  value={otherIssueText}
                  style={{
                    textAlignVertical: 'top', // for android cursor position
                    minHeight: 80,
                    borderWidth: 1,
                    borderColor: 'grey',
                    padding: 20,
                    justifyContent: 'flex-start',
                    fontSize: 16,
                  }}
                />
              </View>
            )}
          {entity === 'trip' &&
            isSubIssueView &&
            checkedIssueId === 'other' && (
              <View style={{ padding: 20 }}>
                <TextInput
                  multiline
                  numberOfLines={4}
                  placeholder={'In a few words, explain your rejection reason... (Required*)'}
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  onChangeText={onChangeTripRejectReason}
                  value={tripRejectionReason}
                  style={{
                    textAlignVertical: 'top', // for android cursor position
                    minHeight: 80,
                    borderWidth: 1,
                    borderColor: 'grey',
                    padding: 20,
                    justifyContent: 'flex-start',
                    fontSize: 16,
                  }}
                />
              </View>
            )}
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

export default IssueList;
