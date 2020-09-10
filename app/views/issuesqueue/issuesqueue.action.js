// @flow
/* eslint-disable no-console */

import type { RNNNavigator } from 'types/RNNavigation';
import type { Trip } from 'types/Trip';
import { Dispatch, ThunkAction } from './types';

import { propEq, defaultTo } from 'ramda';

import { prepareSearch, prepareParams } from 'utils/searchUtils';

import {
  //
  ISSUES_LIST_REQUESTED,
  REQUEST_ISSUES_LIST_SUCCESS,
  REQUEST_ISSUES_LIST_FAILURE,
  //
  ISSUES_NEXT_PAGE_REQUESTED,
  ISSUES_NEXT_PAGE_SUCCESS,
  //
  REQUEST_MARK_ISSUE_READ,
  REQUEST_MARK_ISSUE_READ_SUCCESS,
  REQUEST_MARK_ISSUE_READ_FAILURE,
  //
  RESOLVE_ISSUE_ON_LOT,
  RESOLVE_ISSUE_ON_LOT_SUCCESS,
  RESOLVE_ISSUE_ON_LOT_FAILURE,
  //
  ESCALATE_ISSUE_INIT,
  ESCALATE_ISSUE_SUCCESS,
  ESCALATE_ISSUE_ERROR,
  //
  REQUEST_ISSUE_LOT_DETAIL,
  REQUEST_ISSUE_LOT_DETAIL_SUCCESS,
  REQUEST_ISSUE_LOT_DETAIL_FAILURE,
  //
  SET_SEARCH_QUERY_ISSUE_TRIPS,
  TOGGLE_SEARCHBAR_ISSUE_TRIPS,
  //
  DISTRIBUTE_ISSUE_LOT_REQUESTED,
  DISTRIBUTE_ISSUE_LOT_SUCCESS,
  DISTRIBUTE_ISSUE_LOT_FAILED,
} from './issuesqueue.constants';

import * as issuesQueueService from './issuesqueue.service';
import { setCurrentLotList } from 'views/lotlist/lotlist.action';
import { getAcknowledgedTrips } from 'views/trips/trips.actions';
import { mergePageIntoList } from 'utils';

const serviceQueueServiceByType = {
  issueLots: issuesQueueService.fetchPartialTrips,
  assignedToMe: issuesQueueService.fetchIssuesQueue,
  raisedByMe: issuesQueueService.fetchIssuesQueue,
};
const listNameMap = {
  issueLots: 'partial trips lots',
  raisedByMe: '"raised by me" Issues Queue',
  assignedToMe: '"assigned to me" Issues Queue',
};
const getParamsByListType = {
  assignedToMe: {
    skip_pagination: false,
    view: 'assigned_to_me',
  },
  raisedByMe: {
    skip_pagination: false,
    view: 'raised_by_me',
  },
  issueLots: {},
};

export const fetchIssuesQueue = (navigator: RNNNavigator): ThunkAction => (dispatch: Dispatch) =>
  Promise.all([
    dispatch(fetchAssignedIssuesQueue(navigator)),
    dispatch(fetchRaisedByMeIssuesQueue(navigator)),
    dispatch(fetchPartialTrips(navigator)),
  ]);

type fetchIssuesParams = {
  listType: 'issueLots' | 'assignedToMe' | 'raisedByMe',
  navigator: RNNNavigator,
  page?: number,
  search?: { query: string } | undefined,
};
export const fetchIssuesCommonAction = ({
  listType,
  navigator,
  page = 1,
  search,
}: fetchIssuesParams) => (dispatch: Function, getState: Function) => {
  const page_size = 20;
  const totalCount = getState().issuesqueue.totalCount[listType];
  if (page === 1 || (page - 1) * page_size < totalCount) {
    // console.log(`??? getting ${listType} page ${page}`);
    if (page === 1) {
      dispatch({ type: ISSUES_LIST_REQUESTED, listType });
    } else {
      dispatch({ type: ISSUES_NEXT_PAGE_REQUESTED, listType });
    }
    const pickedSearch = defaultTo(
      prepareSearch(getState().issuesqueue.searchMode[listType].search.query),
    )(search); // {search: ''} || {}
    const listTypeParams = getParamsByListType[listType];
    return serviceQueueServiceByType[listType]({
      ...listTypeParams,
      ...pickedSearch,
      page,
      page_size,
    })
      .then((response: Object) => {
        if (response.status === 'success') {
          if (page === 1) {
            dispatch({
              type: REQUEST_ISSUES_LIST_SUCCESS,
              data: response.data,
              count: response.count,
              listType,
            });
          } else {
            const existingIssues = getState().issuesqueue.unsortedList[listType];
            const mergedIssues = mergePageIntoList(existingIssues, response.data, page, page_size);
            dispatch({
              type: ISSUES_NEXT_PAGE_SUCCESS,
              data: mergedIssues,
              count: response.count,
              listType,
              page,
            });
          }
        } else {
          dispatch({
            type: REQUEST_ISSUES_LIST_FAILURE,
            listType,
            error: response.data.parsedErrorMessage || 'Null data from WS',
          });
          navigator.showInAppNotification({
            screen: 'CopartTransporter.ShowInAppNotification',
            passProps: {
              type: 'error',
              content: response.data.parsedErrorMessage || 'Null data from WS',
            },
            autoDismissTimerSec: 2.0,
          });
        }
      })
      .catch((error: Object) => {
        console.log('error::action ', error);
        dispatch({
          type: REQUEST_ISSUES_LIST_FAILURE,
          listType,
          error: error.response.data.parsedErrorMessage || 'Null data from WS',
        });
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: error.response.data.parsedErrorMessage,
          },
          autoDismissTimerSec: 10.0,
        });
      });
  }
};

export const fetchPartialTrips = (navigator: RNNNavigator, page: number) => (dispatch: Function) =>
  dispatch(fetchIssuesCommonAction({ listType: 'issueLots', navigator, page }));

/**
 * @description Load ASSIGNED issues queue
 * @param <none>
 * @returns Array<Lot>
 */
export const fetchAssignedIssuesQueue = (
  navigator: RNNNavigator,
  page: number = 1,
): ThunkAction => (dispatch: Dispatch) =>
  dispatch(fetchIssuesCommonAction({ listType: 'assignedToMe', page, navigator }));

/**
 * @description Load RAISED BY ME issues queue
 * @param <none>
 * @returns Array<Lot>
 */
export const fetchRaisedByMeIssuesQueue = (navigator: RNNNavigator, page: number): ThunkAction => (
  dispatch: Dispatch,
) => dispatch(fetchIssuesCommonAction({ listType: 'raisedByMe', page, navigator }));

export const fetchIssueLotDetail = (assignmentDetailId: number, navigator: RNNNavigator) => (
  dispatch: Dispatch,
) => {
  dispatch({ type: REQUEST_ISSUE_LOT_DETAIL, listType: 'raised' });
  return issuesQueueService
    .fetchIssueLotDetail(parseInt(assignmentDetailId, 10))
    .then((response: Object) => {
      if (
        Object.keys(response.data).length > 0 &&
        parseInt(response.data.dispatchAssignmentDetailId, 10) === parseInt(assignmentDetailId, 10)
      ) {
        dispatch({ type: REQUEST_ISSUE_LOT_DETAIL_SUCCESS, data: response.data });
        return response;
      }
      dispatch({ type: REQUEST_ISSUE_LOT_DETAIL_FAILURE });
      return response;
    })
    .catch((error: Object) => {
      console.log('response::error ', error);
      dispatch({ type: REQUEST_ISSUE_LOT_DETAIL_FAILURE });
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: 'Error fetching lot details! Please try again...',
        },
        autoDismissTimerSec: 2.0,
      });
      navigator.pop();
      dispatch({ type: REQUEST_ISSUE_LOT_DETAIL_FAILURE });
    });
};

export const markResolvedIssueAsRead = (
  assignmentDetailId: number,
  messageId: number,
  listType: string,
  navigator: Object,
) => (dispatch: Function) => {
  dispatch({
    type: REQUEST_MARK_ISSUE_READ,
    listType,
  });
  return issuesQueueService
    .readResolvedIssue(assignmentDetailId, messageId)
    .then((response: Object) => {
      if (response.status === 'success') {
        dispatch({
          type: REQUEST_MARK_ISSUE_READ_SUCCESS,
        });
        dispatch(fetchRaisedByMeIssuesQueue(navigator));
        navigator.pop();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: 'Issue marked READ successfully!',
          },
          autoDismissTimerSec: 2.0,
        });
      } else {
        dispatch({
          type: REQUEST_MARK_ISSUE_READ_FAILURE,
          listType,
        });
        navigator.pop();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: response.data.parsedErrorMessage,
          },
          autoDismissTimerSec: 10.0,
        });
      }
    })
    .catch((error: Object) => {
      console.log('error: ', error);
      dispatch({
        type: REQUEST_MARK_ISSUE_READ_FAILURE,
        listType,
      });
      navigator.pop();
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: 'Problems marking issue as READ!',
        },
        autoDismissTimerSec: 2.0,
      });
    });
};

export const resolveIssueOnLot = (
  action: string,
  assignmentDetailId: number,
  params: Object,
  listType: string,
  navigator: RNNNavigator,
  dismissModal?: boolean = false,
  updateLotList: () => void, // updateLotList?: (trips: Array<Trip>) => void,
  tripId: number,
  comingFromIssuesQueue: boolean = false,
) => (dispatch: Function) => {
  dispatch({
    type: RESOLVE_ISSUE_ON_LOT,
    listType,
  });
  const payload = { resolution_action: action, ...params };
  return issuesQueueService
    .resolveIssueOnLot(assignmentDetailId, payload)
    .then((response: { status: string, data: { parsedErrorMessage: string } }) => {
      let notification = {};
      if (response.status === 'success') {
        dispatch({
          type: RESOLVE_ISSUE_ON_LOT_SUCCESS,
          listType,
        });
        dispatch(fetchIssuesQueue(navigator));
        notification = {
          type: 'success',
          content: 'Action taken on the issue succesfully!',
        };
      } else {
        dispatch({
          type: RESOLVE_ISSUE_ON_LOT_FAILURE,
          listType,
        });
        notification = {
          type: 'error',
          content: response.data.parsedErrorMessage,
        };
      }

      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          ...notification,
        },
        autoDismissTimerSec: 10.0,
      });

      if (updateLotList) {
        navigator.pop();
        // updateLotList(); // not needed
        dispatch(getAcknowledgedTrips({ navigator })).then((trips: Array<Trip>) => {
          const currentTrip = trips.find(propEq('tripId', tripId));
          if (currentTrip) {
            const lotList = currentTrip.lots;
            dispatch(setCurrentLotList(lotList));
          }
        });
        return;
      }

      if (dismissModal) {
        navigator.dismissModal();
        setTimeout(() => {
          navigator.handleDeepLink({
            link: 'popTo/issuesQueue',
            payload: {
              ...notification,
            },
          });
        }, 300);
        return;
      }

      if (!comingFromIssuesQueue) {
        navigator.pop();
      }
    })
    .catch((error: Object) => {
      console.log('error: ', error);
      dispatch({
        type: RESOLVE_ISSUE_ON_LOT_FAILURE,
        listType,
      });
      if (dismissModal) {
        navigator.dismissModal();
        setTimeout(() => {
          navigator.handleDeepLink({
            link: 'popTo/issuesQueue',
            payload: {
              type: 'error',
              content: 'Problems taking action on the issue!\n Please try again.',
            },
          });
        }, 300);
      } else {
        navigator.pop();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: 'Problems taking action on the issue!\n Please try again.',
          },
          autoDismissTimerSec: 2.0,
        });
      }
    });
};

export const escalateIssue = (assignmentDetailId: number, navigator: Object) => (
  dispatch: Function,
) => {
  dispatch({ type: ESCALATE_ISSUE_INIT });
  return issuesQueueService
    .escalateIssue(assignmentDetailId)
    .then((response: Object) => {
      if (response.status && response.status === 'success') {
        dispatch({ type: ESCALATE_ISSUE_SUCCESS });
        dispatch(fetchAssignedIssuesQueue(navigator));
        navigator.pop();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: 'Issue escalated successfully!',
          },
          autoDismissTimerSec: 2.0,
        });
      } else {
        dispatch({ type: ESCALATE_ISSUE_ERROR });
        navigator.pop();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: response.data.parsedErrorMessage,
          },
          autoDismissTimerSec: 10.0,
        });
      }
    })
    .catch((error: Object) => {
      console.log('error::ws: ', error);
      dispatch({ type: ESCALATE_ISSUE_ERROR });
      navigator.pop();
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: 'Issue escalation failed!',
        },
        autoDismissTimerSec: 2.0,
      });
    });
};

const toggleSearchVisible = (visible: boolean, listType: string) => ({
  type: TOGGLE_SEARCHBAR_ISSUE_TRIPS,
  visible,
  listType,
});

export const showSearch = (listType: string) => toggleSearchVisible(true, listType);
export const hideSearch = (listType: string) => toggleSearchVisible(false, listType);

export const setSearchQuery = (query: string, listType: string, navigator: Object) => (
  dispatch: Function,
) => {
  dispatch({
    type: SET_SEARCH_QUERY_ISSUE_TRIPS,
    query,
    listType,
  });
  return dispatch(
    fetchIssuesCommonAction({ listType, navigator, search: query ? { search: query } : null }),
  );
};

export const resetSearch = (listType: string, navigator: Object) => (dispatch: Dispatch) => {
  dispatch(hideSearch(listType));
  return dispatch(setSearchQuery('', listType, navigator));
};

export const distributeIssueLot = (
  assignmentDetailId: number,
  payload: Object,
  navigator: RNNNavigator,
) => (dispatch: Function) => {
  dispatch({ type: DISTRIBUTE_ISSUE_LOT_REQUESTED, listType: 'assigned' });
  return issuesQueueService
    .resolveIssueOnLot(assignmentDetailId, payload)
    .then((response: any) => {
      if (response.status === 'success') {
        dispatch({ type: DISTRIBUTE_ISSUE_LOT_SUCCESS });
        dispatch(fetchAssignedIssuesQueue(navigator));
        // I tried dismissing the modal first and then pop'ing, but couldn't make it work.
        // eslint-disable-next-line
        navigator &&
          navigator.handleDeepLink({
            link: 'popTo/issuesQueue',
            payload: {
              assignmentDetailId,
              type: 'success',
              content: `Lot ${assignmentDetailId} distributed successfully!`,
            },
          });
      } else {
        dispatch({ type: DISTRIBUTE_ISSUE_LOT_FAILED, listType: 'assigned' });
        // I tried dismissing the modal first and then pop'ing, but couldn't make it work.
        // eslint-disable-next-line
        navigator &&
          navigator.handleDeepLink({
            link: 'popTo/issuesQueue',
            payload: {
              assignmentDetailId,
              type: 'success',
              content: `Lot ${assignmentDetailId} could not be distributed! Please try again!`,
            },
          });
      }
      return response;
    })
    .catch((error: any) => {
      dispatch({ type: DISTRIBUTE_ISSUE_LOT_FAILED, listType: 'assigned' });
      // eslint-disable-next-line
      navigator &&
        navigator.handleDeepLink({
          link: 'popTo/issuesQueue',
          payload: {
            assignmentDetailId,
            type: 'error',
            content: `Error distributing Lot ${assignmentDetailId}. Please try again!`,
          },
        });
      return error;
    });
};
