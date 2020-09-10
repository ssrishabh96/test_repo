// @flow

import type { IssueViewProps as Props } from './types';
import type { Issue } from '../../types/Issue';

import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { prop } from 'ramda';

import { fetchNewIssueReasons, fetchDeclineTripReasons } from './newissue.action';
import { raiseIssueSelector } from './newissue.redux';

import IssueList from './components/IssueList';
import ViewHeader from './components/ViewHeader';
import FullScreenLoader from 'components/custom/FullScreenLoader';

import icons from 'constants/icons';
import { defaultNavStyles } from 'styles';
import * as helpers from './helpers';

export const SHOW_TEXTBOX_ISSUE_CODES = ['unable_to_reach_location', 'other'];

class NewIssue extends Component<Props & *> {
  static navigatorStyle = defaultNavStyles;

  static navigatorButtons = {
    leftButtons: [
      {
        icon: icons.tripsScreen.tripIconClose,
        id: 'closeModal',
      },
    ],
  };

  constructor(props: Object) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentDidMount() {
    const { lot, comingFromTripList, navigator } = this.props;
    if (comingFromTripList === true) {
      this.props.fetchDeclineTripReasons(navigator);
    } else {
      this.props.fetchNewIssueReasons(lot.dispatch_assignment_detail_id, navigator);
    }
  }

  onNavigatorEvent = (event: Object) => {
    if (event.id === 'closeModal') {
      this.props.navigator.dismissModal({
        animationType: 'slide-down',
      });
    }
  };

  handleParentIssuePressed = (issue: Issue) => {
    const { navigator, entity, data, isLoading, bucket, comingFromTripList, charges } = this.props;
    navigator.push({
      screen: 'CopartTransporter.SubIssueView',
      title: 'Can\'t Pickup',
      passProps: {
        issue,
        entity,
        data,
        bucket,
        showTextBox: SHOW_TEXTBOX_ISSUE_CODES.includes(issue.code),
        comingFromTripList,
        charges,
        isLoading,
      },
    });
  };

  render() {
    const entity = prop('entity')(this.props);
    const data = prop('data')(this.props);
    const issueReasons = prop('issueReasons')(this.props);
    const isLoading = prop('isLoading')(this.props);

    const headerText = helpers.getHeaderText(entity, data);

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ViewHeader
          entity={entity}
          headerText={headerText}
          data={data}
        />
        {isLoading ? (
          <FullScreenLoader isLoading={isLoading} />
        ) : (
          <IssueList
            data={issueReasons && issueReasons.length > 0 && issueReasons}
            onIssueItemPressed={this.handleParentIssuePressed}
            isSubIssueView={false}
            entity={entity}
          />
        )}
      </View>
    );
  }
}

const mapDispatchToProps = {
  fetchNewIssueReasons,
  fetchDeclineTripReasons,
};

export default connect(raiseIssueSelector, mapDispatchToProps)(NewIssue);
