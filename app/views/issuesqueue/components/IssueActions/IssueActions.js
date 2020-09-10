// @flow
/* eslint-disable react/no-array-index-key */

import type { Props } from './types';

import React, { PureComponent } from 'react';
import { View, Text, KeyboardAvoidingView, TextInput, ScrollView } from 'react-native';
import renderIf from 'render-if';

import { Grid, Row } from 'react-native-easy-grid';
import RoundButton from '../RoundButton';

import { issueResolutionMap } from 'constants/Issue';
import Locale from 'utils/locale';
import colors from 'styles/colors';

type State = {
  comments: string,
};

export default class IssueActions extends PureComponent<Props, State> {
  state = {
    comments: '',
  };

  render() {
    const {
      lot,
      comingFrom,
      navigator,
      onReadResolvedIssue,
      onResolveIssue,
      onDistributeIssueLot,
    } = this.props;

    const renderIfResolvedIssue = renderIf(lot.messageStatus === 'I');
    const renderIfActiveIssue = renderIf(lot.messageStatus === 'A');
    const renderIfComingFromRaisedByMe = renderIf(comingFrom === 'raised');
    const renderIfComingFromAssigned = renderIf(comingFrom === 'assigned');

    let availableActions = lot.availableActions || []; // eslint-disable-line prefer-const
    const chunk = 2; // represents how many buttons rendered in one row
    const actionsArr = [];
    let temp = [];

    // 'trip_maintenance' is only available for dispatcher. NA on mobile app. Filtering the list out
    // to ignore that action.
    availableActions =
      (availableActions &&
        availableActions.filter((code: string) => code !== 'trip_maintenance')) ||
      [];

    for (let i = 0, j = availableActions.length; i < j; i += chunk) {
      temp = availableActions.slice(i, i + chunk);
      actionsArr.push(temp);
    }

    const renderIfAvailableActionsGreaterThanOne = renderIf(
      availableActions && availableActions.length > 0,
    );

    const renderIfNoAvailableActions = renderIf(
      !availableActions || (availableActions && availableActions.length === 0),
    );

    const reportedByName =
      (lot.createdByName && lot.createdByName.split('-')[0]) || lot.createdByName;

    return (
      <View style={{ flex: 1 }}>
        {renderIfResolvedIssue(
          <View
            style={{
              marginTop: 10,
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 3 }}>
              {Locale.translate('issuesQueue.issueDetail.message.responseComments')}:{' '}
            </Text>
            <View
              style={{
                padding: 10,
                minHeight: 80,
              }}
            >
              <Text style={{ fontSize: 15, fontStyle: 'italic', opacity: 0.8 }}>
                {lot.response_comments}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'space-around',
              }}
            >
              <RoundButton
                style={{ flex: 1 }}
                onPress={() => onReadResolvedIssue()}
                btnLabel={Locale.translate('issuesQueue.issueDetail.message.read')}
                btnColor={colors.LIGHT_GREEN}
              />
              <RoundButton
                style={{ flex: 1 }}
                onPress={() => navigator.pop()}
                btnLabel={Locale.translate('issuesQueue.issueDetail.message.cancel')}
                btnColor={colors.DARK_RED}
              />
            </View>
          </View>,
        )}
        {renderIfActiveIssue(
          <ScrollView style={{ flex: 1, padding: 20 }}>
            {lot.createdByComment && (
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
                  {reportedByName}'s Notes:
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    marginTop: 5,
                    fontStyle: 'italic',
                    marginLeft: 10,
                    color: 'black',
                  }}
                >
                  {lot.createdByComment || 'No Comments'}
                </Text>
              </View>
            )}
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
              {Locale.translate('issues.actions.Notes')}
            </Text>
            <KeyboardAvoidingView
              behavior="padding"
              style={{ marginVertical: 10 }}
              resetScrollToCoords={{ x: 0, y: 0 }}
              scrollEnabled={false}
            >
              <TextInput
                style={{
                  minHeight: 120,
                  padding: 10,
                  fontSize: 16,
                  borderWidth: 1.0,
                  borderColor: 'grey',
                  justifyContent: 'flex-start',
                  color: colors.GRAY_DARK,
                }}
                multiline
                numberOfLines={5}
                placeholder={Locale.translate(
                  'issuesQueue.issueDetail.resolutionBtn.resolutionNotes',
                )}
                placeholderTextColor={colors.GRAY_DARK}
                underlineColorAndroid={'transparent'}
                onChangeText={(comments: string) => {
                  this.setState({ comments });
                }}
                value={this.state.comments}
              />
            </KeyboardAvoidingView>
            {renderIfComingFromAssigned(
              <View style={{ marginBottom: 30 }}>
                {renderIfAvailableActionsGreaterThanOne(
                  <Grid>
                    {actionsArr.map((data: Array<string>, index: number) => (
                      <Row key={`data-${index}`}>
                        {data.map((action: string) => (
                          <RoundButton
                            key={action.title}
                            style={{ flex: 1 }}
                            onPress={() => onResolveIssue(action, this.state.comments)}
                            btnLabel={Locale.translate(issueResolutionMap[action].title)}
                            btnColor={issueResolutionMap[action].btnColor}
                          />
                        ))}
                      </Row>
                    ))}
                    <RoundButton
                      style={{ flex: 1 }}
                      onPress={() => onDistributeIssueLot()} // onResolveIssue('trip_maintenance')
                      btnLabel={Locale.translate(
                        'issuesQueue.issueDetail.resolutionBtn.changeDriverOrGroup',
                      )}
                      btnColor={colors.DARK_YELLOW}
                    />
                  </Grid>,
                )}
                {renderIfNoAvailableActions(
                  <Text style={{ fontStyle: 'italic' }}>
                    {Locale.translate('issues.actions.noAvailableActions')}
                  </Text>,
                )}
              </View>,
            )}
            {renderIfComingFromRaisedByMe(
              <RoundButton
                onPress={() => onResolveIssue('cancel')}
                btnLabel={Locale.translate('issuesQueue.issueDetail.resolutionBtn.canPickup')}
                btnColor={colors.COPART_BLUE}
              />,
            )}
          </ScrollView>,
        )}
      </View>
    );
  }
}
