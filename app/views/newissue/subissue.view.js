// @flow

import type { SubIssueViewProps as Props, SubmitIssueType, SubIssueState as State } from './types';
import type { Issue } from '../../types/Issue';

import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import renderIf from 'render-if';
import { prop, keys } from 'ramda';

import { submitIssue as submitIssueForLot } from '../lotview/lotview.action';
import { tripAction } from '../trips/trips.actions';

import IssueList from './components/IssueList';
import ViewHeader from './components/ViewHeader';
import ChargesOverLimit from './components/ChargesOverLimit';

import { defaultNavStyles } from '../../styles';
import * as helpers from './helpers';
import colors from 'styles/colors';

class SubIssueView extends Component<Props, State> {
  static navigatorStyle = defaultNavStyles;

  state = {
    checkedIssueId: null,
    showTextBox: false,
    otherIssueText: '',
    tripRejectReason: '',
  };

  setCheckedIssueId = (code: string) => {
    this.setState({ checkedIssueId: this.state.checkedIssueId === code ? null : code });
  };

  handleIssueItemPressed = (issue: Issue) => {
    this.setCheckedIssueId(issue.code);
    // Handle subissue's case when 'Other' is selected
    if (issue.code === 'other') {
      this.setState({ showTextBox: !this.state.showTextBox });
    }
  };

  prepareIssueData = (chargesOverLimitData?: Object = {}): SubmitIssueType => {
    const { issue, entity } = this.props;
    const { otherIssueText, checkedIssueId, tripRejectReason } = this.state;

    // start prepareIssueData for "Trip" type entity
    if (entity === 'trip') {
      if ((issue.code === 'other' || checkedIssueId === 'other') && tripRejectReason.length === 0) {
        this.props.navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: 'Please briefly describe your reason for rejection!',
          },
          autoDismissTimerSec: 1.0,
        });
        return { notification: false };
      }

      let declineTripPayload = {
        decline_reason: (issue && issue.description) || (issue && issue.code) || '',
      };

      if (issue && issue.subtypes.length > 0 && checkedIssueId !== null) {
        const subIssue =
          issue &&
          issue.subtypes &&
          issue.subtypes.find(
            // $FlowFixMe
            (i: { code: string, description: string }) => i.code === checkedIssueId,
          );
        declineTripPayload = {
          ...declineTripPayload,
          decline_reason:
            (subIssue !== null && `${issue.description} - ${subIssue.description}`) ||
            issue.description,
        };
      }

      // attach any additional comments, if any
      if ((issue.code === 'other' || checkedIssueId === 'other') && tripRejectReason.length > 0) {
        declineTripPayload = {
          ...declineTripPayload,
          decline_reason: `${declineTripPayload.decline_reason} - ${tripRejectReason}`,
          // comments: tripRejectReason,
        };
      }
      return declineTripPayload;
    }
    // end prepareIssueData for "Trip" type entity

    // start prepareIssueData for "Lot" type entity
    let issueToSubmit = {};
    if ((issue.code === 'other' || checkedIssueId === 'other') && otherIssueText.length === 0) {
      this.props.navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: 'Please briefly describe your reason for rejection!',
        },
        autoDismissTimerSec: 1.0,
      });
      return { notification: false };
    }

    // set issue "type"
    issueToSubmit.type = issue.code;

    // attach any additional comments, if any
    if (otherIssueText && otherIssueText.length > 0) {
      issueToSubmit = {
        ...issueToSubmit,
        comments: otherIssueText,
      };
    }

    if (issue && issue.code === 'other') {
      issueToSubmit = {
        ...issueToSubmit,
        subtype: 'other',
      };
      return issueToSubmit;
    }
    // end prepareIssueData for "Lot" type entity

    // start return results
    if (issue && issue.code === 'charges_over_limit') {
      issueToSubmit = {
        ...issueToSubmit,
        subtype: 'charge_difference',
        additional_data: chargesOverLimitData,
      };
      return issueToSubmit;
    } else if (issue.subtypes && issue.subtypes.length > 0 && checkedIssueId != null) {
      issueToSubmit = {
        ...issueToSubmit,
        subtype: checkedIssueId,
      };
      return issueToSubmit;
    }
    // end return results

    return undefined;
  };

  handleOnSubmitIssue = (chargesOverLimitData?: Object = {}) => {
    const { navigator, entity, bucket, data, comingFromTripList } = this.props;

    const goBackToListView = () => {
      if (this.props.entity === 'trip') {
        navigator.dismissModal({
          animated: true,
          animationType: 'fade',
        });

        if (comingFromTripList === true) {
          setTimeout(
            () =>
              navigator.handleDeepLink({
                link: 'popTo/tripList',
              }),
            300,
          );
        }
      } else {
        navigator.dismissModal({
          animated: true,
          animationType: 'fade',
        });
        setTimeout(
          () =>
            navigator.handleDeepLink({
              link: 'popTo/lotList',
            }),
          300,
        );
      }
    };

    const issueToSubmit = this.prepareIssueData(chargesOverLimitData);
    if (!issueToSubmit || (issueToSubmit && keys(issueToSubmit).length <= 0)) {
      this.props.navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: 'Error submitting issue. Please try again!',
        },
        autoDismissTimerSec: 1.0,
      });
      return;
    } else if (
      issueToSubmit &&
      'notification' in issueToSubmit &&
      issueToSubmit.notification === false
    ) {
      // notification was thrown in trip type prepareIssueData,
      // don't show notifiacation again here.
      return;
    }

    if (entity === 'lot') {
      const lot = data;
      this.props.submitIssueForLot(lot, bucket, issueToSubmit, goBackToListView, navigator);
    } else if (entity === 'trip') {
      const selectedTripIds = data;
      this.props.tripAction(selectedTripIds, 'decline', issueToSubmit, navigator, goBackToListView);
    }
  };

  render() {
    const { issue } = this.props;
    const { checkedIssueId, tripRejectReason } = this.state;

    const renderIfChargesAreOverLimit = renderIf(issue.code === 'charges_over_limit');
    const renderGeneralSubIssues = renderIf(issue.code !== 'charges_over_limit');

    const entity = prop('entity')(this.props);
    const data = prop('data')(this.props);
    const headerText = helpers.getHeaderText(entity, data);

    // propOr(false, 'isLoading')(this.props.charges);
    const isLoading = prop('isLoading')(this.props);

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ViewHeader
          entity={entity}
          headerText={headerText}
          data={data}
          issueText={issue.description}
        />
        {renderIfChargesAreOverLimit(
          <ChargesOverLimit
            charges={this.props.charges}
            navigator={this.props.navigator}
            onSubmit={this.handleOnSubmitIssue}
            isLoading={isLoading}
          />,
        )}
        {renderGeneralSubIssues(
          <View>
            <IssueList
              data={issue.subtypes}
              onIssueItemPressed={this.handleIssueItemPressed}
              isSubIssueView
              checkedIssueId={(issue.code === 'other' && 'other') || checkedIssueId}
              entity={entity}
              // showTextBox={showTextBox === false || this.state.showTextBox}
              otherIssueText={this.state.otherIssueText || ''}
              tripRejectionReason={this.state.tripRejectReason || ''}
              onChangeOtherIssueText={(val: string) => this.setState({ otherIssueText: val })}
              onChangeTripRejectReason={(val: string) => this.setState({ tripRejectReason: val })}
            />
            {(checkedIssueId !== null ||
              issue.subtypes.length === 0 ||
              issue.code === 'other' ||
              // showTextBox === true ||
              tripRejectReason.length > 0 ||
              this.state.otherIssueText.length > 0) && (
                <View style={{ margin: 50 }}>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.COPART_BLUE,
                      padding: 5,
                      height: 50,
                      borderRadius: 55 / 2,
                    }}
                    onPress={this.handleOnSubmitIssue}
                  >
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Submit</Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>,
        )}
      </ScrollView>
    );
  }
}

const mapDispatchToProps = {
  submitIssueForLot,
  tripAction,
};

export default connect(null, mapDispatchToProps)(SubIssueView);
