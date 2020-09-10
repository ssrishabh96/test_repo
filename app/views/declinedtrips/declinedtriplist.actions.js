// @flow

import { Dispatch, ThunkAction } from './types';
import { RNNNavigator } from 'types/RNNavigation';
import { prepareSearch } from 'utils/searchUtils';
import { mergePageIntoList } from 'utils';
import { defaultTo } from 'ramda';

import {
  //
  DECLINED_LIST_REQUESTED,
  REQUEST_DECLINED_LIST_SUCCESS,
  REQUEST_DECLINED_LIST_FAILED,
  //
  OVERRIDE_TRIP_REJECTION_REQUESTED,
  OVERRIDE_TRIP_REJECTION_SUCCESS,
  OVERRIDE_TRIP_REJECTION_FAILURE,
  //
  REMOVE_PERSONNEL_REQUESTED,
  REMOVE_PERSONNEL_SUCCESS,
  REMOVE_PERSONNEL_FAILURE,
  //
  SET_SEARCH_QUERY_DECLINED_TRIPS,
  TOGGLE_SEARCHBAR_DECLINED_TRIPS,
  //
  REQUEST_DECLINED_TRIPS_NEXTPAGE_REQUESTED,
  REQUEST_DECLINED_TRIPS_NEXTPAGE_SUCCESS,
  //
  TAKE_TRIP_BACK_REQUESTED,
  TAKE_TRIP_BACK_SUCCESS,
  TAKE_TRIP_BACK_FAILURE,
  //
} from './declinedtriplist.constants';
import * as declineTripsService from './declinedtrips.service';
import { tripAction } from 'views/trips/trips.service';

export const fetchDeclinedTripList = (navigator: RNNNavigator): ThunkAction => (
  dispatch: Dispatch,
) =>
  Promise.all([
    dispatch(fetchRaisedByMeDeclinedTrips(navigator)),
    dispatch(fetchAssignedDeclinedTrips(navigator)),
  ]);

const getParamsByListType = {
  raisedByMe: {
    skip_pagination: false,
    view: 'raised_by_me',
  },
  assignedToMe: {
    skip_pagination: false,
    view: 'assigned_to_me',
  },
};

type CommonParamsType = {
  listType: 'raisedByMe' | 'assignedToMe',
  page?: number,
};
export const fetchDeclinedListCommonAction = ({
  listType,
  page = 1,
  search,
  navigator,
}: CommonParamsType) => (dispatch: Dispatch, getState: Function) => {
  const page_size = 20;
  const totalCount = getState().declinedtriplist.totalCount[listType];
  if (page === 1 || (page - 1) * page_size < totalCount) {
    // console.log(`??? getting ${listType} page ${page}`);
    if (page === 1) {
      dispatch({ type: DECLINED_LIST_REQUESTED, listType });
    } else {
      dispatch({ type: REQUEST_DECLINED_TRIPS_NEXTPAGE_REQUESTED, listType });
    }
    const pickedSearch = defaultTo(
      prepareSearch(getState().declinedtriplist.searchMode[listType].search.query),
    )(search); // {search: ''} || {}

    const listTypeParams = getParamsByListType[listType];
    return declineTripsService
      .fetchDeclinedTripsQueue({
        ...listTypeParams,
        ...pickedSearch,
        page,
        page_size,
      })
      .then((response: { status: string, data: Array<Trip>, count: number }) => {
        if (response.status === 'success') {
          if (page === 1) {
            dispatch({
              type: REQUEST_DECLINED_LIST_SUCCESS,
              listType,
              data: response.data,
              count: response.count,
            });
          } else {
            const existingTrips = getState().declinedtriplist[listType];
            const mergedTrips = mergePageIntoList(existingTrips, response.data, page, page_size);
            dispatch({
              type: REQUEST_DECLINED_TRIPS_NEXTPAGE_SUCCESS,
              listType,
              data: mergedTrips,
              count: response.count,
              page,
            });
          }
        } else {
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
      .catch((error: any) => {
        console.log(`error in ${listType}: `, error.data.errors);
        const message = listType === 'raisedByMe' ? 'raised by you' : 'assigned to you';
        if (navigator) {
          navigator.showInAppNotification({
            screen: 'CopartTransporter.ShowInAppNotification',
            passProps: {
              type: 'error',
              content: 'Error retrieving list. Please try again...',
            },
            autoDismissTimerSec: 2,
          });
        }
        dispatch({
          type: REQUEST_DECLINED_LIST_FAILED,
          listType,
          error: `Error fetching declined trips ${message}!`,
        });
      });
  }
};

/**
 * @description Load raised by me declined trips list
 * @param page - number - the page number to retrieve. defaults to 1
 * @returns Array<Trip>
 */
export const fetchRaisedByMeDeclinedTrips = (
  navigator: RNNNavigator,
  page?: number,
): ThunkAction => (dispatch: Dispatch) =>
  dispatch(fetchDeclinedListCommonAction({ listType: 'raisedByMe', page, navigator }));

/**
 * @description Load assigned to me declined trips list
 * @param page - number - the page number to retrieve. defaults to 1
 * @returns Array<Trip>
 */
export const fetchAssignedDeclinedTrips = (navigator: RNNNavigator, page?: number): ThunkAction => (
  dispatch: Dispatch,
) => dispatch(fetchDeclinedListCommonAction({ listType: 'assignedToMe', page, navigator }));

export const takeTripBackAndAccept = (navigator: RNNNavigator, tripIds: Array<number>) => (
  dispatch: Dispatch,
) => {
  dispatch({ type: TAKE_TRIP_BACK_REQUESTED, listType: 'raisedByMe' });
  return tripAction(tripIds, 'cancel_decline', {})
    .then((response: Object) => {
      if (response && response.status === 'success') {
        dispatch(fetchRaisedByMeDeclinedTrips(navigator));
        dispatch({ type: TAKE_TRIP_BACK_SUCCESS, listType: 'raisedByMe' });
        return response;
      }
      throw new Error(response);
    })
    .catch((error: Object) => {
      dispatch({ type: TAKE_TRIP_BACK_FAILURE, listType: 'raisedByMe', error: null });
      return error;
    });
};

export const removePersonnel = (tripIds: Array<number>, navigator: RNNNavigator) => (
  dispatch: Function,
) => {
  dispatch({ type: REMOVE_PERSONNEL_REQUESTED, listType: 'assignedToMe' });
  return declineTripsService
    .reclaimTrip(tripIds)
    .then((response: Object) => {
      if (response.status === 'success') {
        dispatch({ type: REMOVE_PERSONNEL_SUCCESS });
        dispatch(fetchAssignedDeclinedTrips(navigator));
        navigator.pop();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: 'Trip unassigned successfully!',
          },
          autoDismissTimerSec: 2.0,
        });
      } else {
        dispatch({ type: REMOVE_PERSONNEL_FAILURE, error: 'Remove personnel error' });
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
      dispatch({ type: REMOVE_PERSONNEL_FAILURE, error });
      navigator.pop();
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: `WS Error occurred: \n ${JSON.stringify(error)}`,
        },
        autoDismissTimerSec: 2.0,
      });
    });
};

export const overrideTripRejection = (
  tripId: number,
  reason: string,
  navigator: Object,
  isLoadingCb: Function,
) => (dispatch: Dispatch) => {
  dispatch({ type: OVERRIDE_TRIP_REJECTION_REQUESTED });
  return declineTripsService
    .overrideTripRejection(tripId, reason)
    .then((response: Object) => {
      if (response && response.data === 'success') {
        dispatch({ type: OVERRIDE_TRIP_REJECTION_SUCCESS });
        navigator.pop();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: 'Rejection override successful',
          },
          autoDismissTimerSec: 2.0,
        });
      } else {
        dispatch({ type: OVERRIDE_TRIP_REJECTION_FAILURE });
        navigator.pop();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: response.data.parsedErrorMessage,
          },
          autoDismissTimerSec: 2.0,
        });
      }
      dispatch(fetchAssignedDeclinedTrips(navigator));
      isLoadingCb && isLoadingCb();
    })
    .catch((error: Object) => {
      console.log('error::ws: ', error);
      dispatch({ type: OVERRIDE_TRIP_REJECTION_FAILURE });
      navigator.pop();
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: 'Rejection override unsuccessful',
        },
        autoDismissTimerSec: 2.0,
      });
    });
};

const toggleSearchVisible = (visible: boolean, listType: string) => ({
  type: TOGGLE_SEARCHBAR_DECLINED_TRIPS,
  visible,
  listType,
});

export const showSearch = (listType: string) => toggleSearchVisible(true, listType);
export const hideSearch = (listType: string) => toggleSearchVisible(false, listType);

export const setSearchQuery = (query: string, listType: string, navigator: Object) => (
  dispatch,
  getState,
) => {
  dispatch({
    type: SET_SEARCH_QUERY_DECLINED_TRIPS,
    query,
    listType,
  });
  return dispatch(
    fetchDeclinedListCommonAction({
      listType,
      navigator,
      search: query ? { search: query } : null,
    }),
  );
};

export const resetSearch = (listType: string, navigator: RNNNavigator) => (dispatch: any) => {
  dispatch(hideSearch(listType));
  return dispatch(setSearchQuery('', listType, navigator));
};
