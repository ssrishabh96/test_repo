// @flow

import type { Lot } from 'types/Lot';
import type { Trip } from 'types/Trip';
import type { RNNNavigator } from 'types/RNNavigation';

import { SubmissionError } from 'redux-form';

import { assoc, pathOr, propEq } from 'ramda';

import { TRANSITION_ACTIONS, LOT_STATUSES } from 'constants/Lot';
import { getLotInfoFromCache } from './lotview.redux';
import { getInProgressLotList, setCurrentLotList } from '../lotlist/lotlist.action';
import { getAcknowledgedTrips } from 'views/trips/trips.actions';
import { getConnectionStatus } from 'views/settings/settings.redux';
import * as lotlistService from '../lotlist/lotlist.service';
import * as lotviewService from './lotview.service';
import composeErrorMessage from 'utils/mappers/errorMessageMapper';

import {
  MOVE_TO_INPROGRESS_REQUESTED,
  MOVE_TO_INPROGRESS_RESPONDED,
  LOT_CHARGES_REQUESTED,
  LOT_CHARGES_RESPONDED,
  CLEAR_LOT_INFO,
  REMOVE_LOT_INFO_FROM_CACHE,
  LOT_INFO_REQUESTED,
  LOT_INFO_RESPONDED,
  LOT_INFO_RESPONDED_ERROR,
  LOT_NOTES_REQUESTED,
  LOT_NOTES_RESPONDED,
} from './lotview.constants';
import { UPDATE_TRIP_IN_ACCEPTED } from '../trips/trips.constants';
import {
  ADD_TO_INTRANSIT,
  SUBMIT_ISSUE_INIT,
  SUBMIT_ISSUE_SUCCESS,
  SUBMIT_ISSUE_FAILURE,
  CACHE_LOT_INFO,
} from '../lotlist/lotlist.constants';

// const getErrorMessage = pathOr('', ['error', 'data', 'message']);

export const clearLotInfo = () => ({
  type: CLEAR_LOT_INFO,
});

const navigateToLotInProgress = (lot: Lot, navigator: RNNNavigator) => (dispatch: Function) => {
  navigator.popToRoot({
    animated: false,
  });
  dispatch(getInProgressLotList(navigator)).then((response) => {
    setTimeout(() => {
      navigator.handleDeepLink({
        link: `inProgress/${lot.number}`,
        // payload: {} // optional to send extra params
      });
    }, 300);
  });
};

export const startForLot = (lot: Lot, navigator: RNNNavigator) => (dispatch: Function) => {
  dispatch({ type: MOVE_TO_INPROGRESS_REQUESTED });
  lotlistService
    .transitionLotCommonService([lot.dispatch_assignment_detail_id], TRANSITION_ACTIONS.IN_PROGRESS)
    .then((response: Object) => {
      if (response.data.status === 'success') {
        // dispatch(cacheLotData(lot.dispatch_assignment_detail_id));
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'warning',
            content: `Lot # ${lot.number} is moved to in progress`,
          },
          autoDismissTimerSec: 1,
        });
        dispatch(navigateToLotInProgress(lot, navigator));
        setTimeout(() => {
          dispatch({ type: MOVE_TO_INPROGRESS_RESPONDED });
        }, 500);
      }
    })
    .catch((error: Object) => {
      console.log('error - startForLot', error);
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          // content: `Error - Unable to move Lot # ${lot.number} to in progress !!\n${getErrorMessage(
          //   error,
          // )}`,
          content: error.response.data.parsedErrorMessage,
        },
        autoDismissTimerSec: 1,
      });
      dispatch({ type: MOVE_TO_INPROGRESS_RESPONDED });
    });
};

export const getLotNotes = (
  assignmentDetailId: number,
  shouldCache: boolean,
  updateLotView: Function, // ?? not used withing this function
) => (dispatch: Function) => {
  dispatch({ type: LOT_NOTES_REQUESTED });
  lotviewService.getLotNotes(assignmentDetailId).then(({ lotNotes }) => {
    if (shouldCache) {
      dispatch({ type: CACHE_LOT_INFO, id: assignmentDetailId, data: { notes: lotNotes } });
    }
    dispatch({ type: LOT_NOTES_RESPONDED, lotNotes });
  });
};

export const getLotCharges = (
  assignmentDetailId: number,
  shouldCache: boolean,
  updateLotView: Function, // ?? not used withing this function
) => (dispatch: Function) => {
  dispatch({ type: LOT_CHARGES_REQUESTED });
  lotviewService.getLotCharges(assignmentDetailId).then(({ charges }) => {
    if (shouldCache) {
      dispatch({ type: CACHE_LOT_INFO, id: assignmentDetailId, data: { charges } });
    }
    dispatch({ type: LOT_CHARGES_RESPONDED, charges });
  });
};

export const getLotInfo = (assignmentDetailId: number) => (dispatch: Function) => {
  dispatch({ type: LOT_INFO_REQUESTED });
  lotviewService
    .getLotInfo(assignmentDetailId)
    .then(({ lotInfo }: Object) => {
      dispatch({ type: LOT_INFO_RESPONDED, lotInfo });
    })
    .catch((error: Object) => {
      dispatch({ type: LOT_INFO_RESPONDED_ERROR, error });
    });
};

export const loadAllLotInfo = (assignmentDetailId: Object, dispatchStatus: number) => (
  dispatch: Function,
  getState: Function,
) => {
  const lotInfo = getLotInfoFromCache(assignmentDetailId)(getState());
  const connectionStatus = getConnectionStatus(getState());
  if (lotInfo) {
    dispatch({ type: LOT_NOTES_RESPONDED, lotNotes: lotInfo.notes });
    dispatch({ type: LOT_CHARGES_RESPONDED, charges: lotInfo.charges });
  } else if (connectionStatus) {
    if (dispatchStatus === LOT_STATUSES.AWAITING_FORM_SUBMISSION) {
      dispatch(cacheLotData(assignmentDetailId, true));
    } else {
      dispatch(getLotNotes(assignmentDetailId));
      dispatch(getLotCharges(assignmentDetailId));
    }
  }
  if (connectionStatus) dispatch(getLotInfo(assignmentDetailId));
};

export const cacheLotData = (assignmentDetailId: number, updateLotView: Function) => (
  dispatch: Function,
) => {
  dispatch(getLotNotes(assignmentDetailId, true, updateLotView));
  dispatch(getLotCharges(assignmentDetailId, true, updateLotView));
};

export const removeLotInfoFromCache = (assignmentDetailId: number) => ({
  type: REMOVE_LOT_INFO_FROM_CACHE,
  id: assignmentDetailId,
});

export const submitDeliveryForm = (
  lot: Lot,
  navigator: RNNNavigator,
  goBackFromLotView: Function,
) => (dispatch: Function) => {
  // anything different need to be done here?
  const newStatus = 'intransit';
  dispatch({ type: ADD_TO_INTRANSIT, lot: assoc('status', newStatus)(lot) });
  dispatch({ type: UPDATE_TRIP_IN_ACCEPTED, lot, status: newStatus });
  navigator.dismissModal();
  goBackFromLotView();

  navigator.showInAppNotification({
    screen: 'CopartTransporter.ShowInAppNotification',
    passProps: {
      type: 'warning',
      content: `Delivery form submitted.\nLot # ${lot.number} is moved to in transit`,
    },
    autoDismissTimerSec: 1.0,
  });
};

/**
 * @description Submit an issue for a particular lot in one of the following bucket:
 *              accepted | inProgress | inTransit
 * @param lot : <Lot> : Lot object to be updated
 * @param lotBucket: {string} : accepted | inprogress | intransit
 * @param issue : {<Issue>} : Issue to be added to the lot
 * @param goBackToLotListView : {Function} : Function which pops twice. Sent by subissues.view.js
 * @returns success action dispatched to respective reducer (by lotBucket)
 */
export const submitIssue = (
  lot: Lot,
  bucket: string,
  issue: Object,
  goBackToLotListView: Function,
  navigator: Object,
): any => (dispatch: Function) => {
  dispatch({ type: SUBMIT_ISSUE_INIT });
  return lotlistService
    .submitIssueForLot(lot, issue)
    .then((response: Object) => {
      const data = pathOr(null, ['data'])(response);
      const status = pathOr(null, ['status'])(response);
      // const errors = pathOr(null, ['data', 'errors'])(response);
      if (status === 200 && data && data.status === 'success') {
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: 'Issue raised successfully!',
          },
          autoDismissTimerSec: 4,
        });
        dispatch({ type: SUBMIT_ISSUE_SUCCESS });
        if (bucket === 'accepted') {
          dispatch(getAcknowledgedTrips({ navigator })).then((trips: Array<Trip>) => {
            const tripId = lot.current_trip_id;
            const currentTrip = trips.find(propEq('tripId', tripId));
            if (currentTrip) {
              const lotList = currentTrip.lots;
              dispatch(setCurrentLotList(lotList));
            }
          });
        }
        goBackToLotListView();
      } else {
        goBackToLotListView();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            // content: `Error - Unable to raise issue on Lot # ${lot.number}!`,
            content: response.data.parsedErrorMessage,
          },
          autoDismissTimerSec: 4,
        });
      }
    })
    .catch((error: Object) => {
      goBackToLotListView();
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          // content: `Error - Unable to raise issue on Lot # ${lot.number} - API Error!!`,
          content: error.response.data.parsedErrorMessage,
        },
        autoDismissTimerSec: 4,
      });
      dispatch({ type: SUBMIT_ISSUE_FAILURE, error });
    });
};

export const requestForms = (assignmentDetailId: number, params: Object) => () =>
  lotviewService
    .postRequestForPaperWork(assignmentDetailId, params)
    .then((res) => {
      // TODO: check for false positive successes ??
      console.log('?? responded', res);
      return res.data;
    })
    .catch((err: Object) => {
      console.log('?? err', err);
      const message = composeErrorMessage(err);
      throw new SubmissionError({ _error: message });
    });
