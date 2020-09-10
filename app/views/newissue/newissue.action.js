// @flow

import {
  FETCH_ISSUE_REASONS_INIT,
  FETCH_ISSUE_REASONS_SUCCESS,
  FETCH_ISSUE_REASONS_FAILURE,
} from './newissue.constants';
import * as newIssueService from './newissue.service';

export const fetchDeclineTripReasons = (navigator: Object) => (dispatch: Function) => {
  dispatch({ type: FETCH_ISSUE_REASONS_INIT });
  newIssueService
    .fetchDeclineTripReasons()
    .then((response: Object) => {
      console.log('response in action: ', response);
      if (response.data.status === 'success') {
        dispatch({ type: FETCH_ISSUE_REASONS_SUCCESS, data: response.data.data });
      } else {
        dispatch({
          type: FETCH_ISSUE_REASONS_FAILURE,
          error: JSON.stringify(response.data),
        });
        navigator.dismissModal();
        setTimeout(
          () =>
            navigator.showInAppNotification({
              screen: 'CopartTransporter.ShowInAppNotification',
              passProps: {
                type: 'error',
                content: `Error fetching issue reasons. \n Error: ${JSON.stringify(
                  response.data.errors,
                )}`,
              },
              autoDismissTimerSec: 2.0,
            }),
          250,
        );
      }
    })
    .catch((error: Object) => {
      console.log('error in action: ', error.response);
      dispatch({
        type: FETCH_ISSUE_REASONS_FAILURE,
        error: 'There was some error fetching the issue reasons. Please try again.',
      });
      navigator.dismissModal();
      setTimeout(
        () =>
          navigator.showInAppNotification({
            screen: 'CopartTransporter.ShowInAppNotification',
            passProps: {
              type: 'error',
              content: `Error fetching issue reasons. \n Error: ${JSON.stringify(error)}`,
            },
            autoDismissTimerSec: 2.0,
          }),
        250,
      );
    });
};

export const fetchNewIssueReasons = (dispatchAssignmentDetailId: number, navigator: Object) => (
  dispatch: Function,
) => {
  dispatch({ type: FETCH_ISSUE_REASONS_INIT });
  newIssueService
    .fetchAvailableIssues(dispatchAssignmentDetailId)
    .then((response: Object) => {
      console.log('response in action: ', response);
      if (response.data.status === 'success') {
        dispatch({ type: FETCH_ISSUE_REASONS_SUCCESS, data: response.data.available_issues });
      } else {
        dispatch({
          type: FETCH_ISSUE_REASONS_FAILURE,
          error: JSON.stringify(response.data.errors),
        });
        navigator.dismissModal();
        setTimeout(
          () =>
            navigator.showInAppNotification({
              screen: 'CopartTransporter.ShowInAppNotification',
              passProps: {
                type: 'error',
                content: `Error fetching issue reasons. \n Error: ${JSON.stringify(
                  response.data.errors,
                )}`,
              },
              autoDismissTimerSec: 2.0,
            }),
          250,
        );
      }
    })
    .catch((error: Object) => {
      console.log('error in action: ', error.response);
      dispatch({
        type: FETCH_ISSUE_REASONS_FAILURE,
        error: 'There was some error fetching the issue reasons. Please try again.',
      });
      navigator.dismissModal();
      setTimeout(
        () =>
          navigator.showInAppNotification({
            screen: 'CopartTransporter.ShowInAppNotification',
            passProps: {
              type: 'error',
              content: `Error fetching issue reasons. \n Error: ${JSON.stringify(error)}`,
            },
            autoDismissTimerSec: 2.0,
          }),
        250,
      );
    });
};
