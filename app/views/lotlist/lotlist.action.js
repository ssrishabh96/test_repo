// @flow

import type { Dispatch, ThunkAction } from './types';
import type { RNNNavigator } from 'types/RNNavigation';
import type { Lot } from 'types/Lot';
import { LotItemType } from './components/LotItem/types';

import {
  propEq,
  compose,
  find,
  propOr,
  filter,
  __,
  map,
  pathOr,
  join,
  head,
  groupBy,
  assoc,
  toPairs,
  ifElse,
  isEmpty,
  values,
  unless,
  sort,
  descend,
  prop,
} from 'ramda';
import moment from 'moment';
import { getFormattedDate } from 'utils/dateUtils';
import { mergePageIntoList } from 'utils';

import { TRANSITION_ACTIONS } from 'constants/Lot';
import {
  SET_CURRENT_LOT_LIST,
  SET_FILTERED_LOT_LIST,
  SET_MULTISELECT_MODE,
  RESET_MULTISELECT_MODE,
  TOGGLE_SELECTION,
  CLEAR_SELECTION,
  TOGGLE_SEARCHBAR,
  SET_SEARCH_QUERY,
  RESET_ALL_FILTERS,
  LOTLIST_REQUESTED,
  LOTLIST_LOADED,
  LOTLIST_FAILED,
  SET_SELECTED_LOT_FILTERS,
  FILTER_MODAL_VISIBLE,
  TRIP_ACTION_REQUESTED,
  TRIP_ACTION_RESPONDED,
  HANDLE_SORT_CHANGE,
  SORT_MODAL_VISIBLE,
  LOTLIST_NEXTPAGE_LOADED,
  LOTLIST_NEXTPAGE_REQUESTED,
} from './lotlist.constants';
import {
  DISTRIBUTE_ASSIGNMENTS_REQUESTED,
  DISTRIBUTE_ASSIGNMENTS_RESPONDED,
} from 'views/assigntolist/assigntolist.constants';

import * as tripActions from '../trips/trips.actions';

import { getConnectionStatus } from 'views/settings/settings.redux';

import * as lotlistService from './lotlist.service';
import * as tripsService from '../trips/trips.service';

import {
  searchByLotNumber,
  sortLotList,
  filterLotList,
  prepareParams2,
  defaultToState,
} from './lotlist.helper';

const getErrors = pathOr([], ['response', 'data', 'errors']);
const getAssignmentsDetailsInfo = propOr([], 'assignment_details_info');
const getMessageItem = ([dispatchAssignmentId, message]) => `${dispatchAssignmentId} : ${message}`;
const getErrorMessage = compose(
  join(' | '),
  map(getMessageItem),
  toPairs,
  getAssignmentsDetailsInfo,
  head,
  getErrors,
);

const groupByCompletionDate = groupBy(compose(getFormattedDate, propOr('', 'completionDate')));
const sortByKey = sort(descend(compose(t => new moment(t), prop('key'))));
const convertToSectionedList = ([key, value]) => ({ key, data: value });
const transformLotsByDate = compose(
  sortByKey,
  map(convertToSectionedList),
  toPairs,
  groupByCompletionDate,
);

const emptyObject = () => ({});
const prepareSearch = ifElse(isEmpty, emptyObject, assoc('search', __, {}));
const prepareSort = ifElse(isEmpty, emptyObject, assoc('sort_by', __, {}));

const combineMessages = compose(join(' | '), head);
const getCommonErrorMessage = compose(unless(isEmpty, combineMessages), values, head, getErrors);

type getLotsCommonActionParams = {
  bucket: 'inProgress' | 'inTransit' | 'completed' | 'distributed',
  filter?: { [string]: string[] } | undefined,
  sort?: { [string]: 'asc' | 'desc' } | undefined,
  search?: { query: string } | undefined,
  updateList: true | false,
  page?: number,
};
export const getLotsCommonAction = ({
  bucket,
  filter,
  sort,
  search,
  page = 1,
  updateList = true,
}: getLotsCommonActionParams) => (dispatch, getState) => {
  if (bucket === 'lotList') {
    return dispatch(
      getLocalFilteredLots({
        filter,
        sort,
        search,
      }),
    );
  }
  const page_size = 20;
  const totalCount = getState().lotlist[bucket].count;
  if (page === 1 || (page - 1) * page_size < totalCount) {
    // console.log(`??? getting ${bucket} page `, page);
    if (page === 1) dispatch({ type: LOTLIST_REQUESTED, bucket });
    if (page > 1) dispatch({ type: LOTLIST_NEXTPAGE_REQUESTED, bucket });
    const defaultParams = { page, page_size };

    const pickedSearch = defaultToState(
      search,
      prepareSearch(getState().lotlist[bucket].search.query),
    );
    const pickedFilter = defaultToState(filter, getState().lotlist[bucket].filters.selectedFilters);
    const pickedSort = defaultToState(
      sort,
      prepareSort(getState().lotlist[bucket].sort.selectedField),
    );
    const params = prepareParams2({
      bucket,
      search: pickedSearch,
      filter: pickedFilter,
      sort: pickedSort,
    });
    return lotlistService
      .getAssignmentsCommonService({ ...defaultParams, ...params })
      .then((response) => {
        if (response.lots) {
          const lots = bucket === 'completed' ? transformLotsByDate(response.lots) : response.lots;
          if (updateList && page === 1) {
            dispatch({
              type: LOTLIST_LOADED,
              bucket,
              lots,
              count: response.totalCount || response.lots.length,
            });
          } else if (updateList) {
            const existingLots = getState().lotlist[bucket].lots;
            const mergedLots = mergePageIntoList(existingLots, lots, page, page_size);
            dispatch({
              type: LOTLIST_NEXTPAGE_LOADED,
              bucket,
              lots: mergedLots,
              count: response.totalCount, // || mergedLots.length,
              page,
            });
          }
          return response;
        }
      })
      .catch((error) => {
        dispatch({ type: LOTLIST_FAILED, bucket, error: getCommonErrorMessage(error) });
        return Promise.reject(error);
      });
  }
  return Promise.resolve();
};

export const getLocalFilteredLots = ({ search, filters = {}, sort }) => (dispatch, getState) => {
  const query = pathOr('', ['query'])(search);
  const field = pathOr({}, ['sort_by'])(sort);

  const lots = pathOr([], ['lotlist', 'lotList', 'lots'])(getState());
  const searchParam = isEmpty(query) ? getState().lotlist.lotList.search.query : query;
  const filterParam = isEmpty(filters)
    ? getState().lotlist.lotList.filters.selectedFilters
    : filters;
  const sortParam = isEmpty(field) ? getState().lotlist.lotList.sort.selectedField : field;

  if (searchParam) {
    const filteredLots = searchByLotNumber(searchParam)(lots);
    return dispatch({ type: SET_FILTERED_LOT_LIST, filteredLots });
  }
  if (filterParam || sortParam) {
    let filteredLots = filterLotList(filterParam)(lots);
    filteredLots = sortLotList(sortParam)(filteredLots);
    return dispatch({ type: SET_FILTERED_LOT_LIST, filteredLots });
  }
  return dispatch({ type: SET_FILTERED_LOT_LIST, filteredLots: lots });
};

type getLotsCommonWithNotificationParams = {
  navigator: Object,
  bucket: 'inProgress' | 'inTransit' | 'completed' | 'distributed',
  filter?: { [string]: string[] } | undefined,
  sort?: { [string]: 'asc' | 'desc' } | undefined,
  search?: { query: string } | undefined,
  page?: number,
  updateList: true | false,
};
export const getLotsCommonActionWithError = ({
  navigator,
  bucket,
  filter,
  sort,
  search,
  page,
  updateList = true,
}: getLotsCommonWithNotificationParams) => (dispatch) => {
  if (bucket === 'lotList') {
    return dispatch(
      getLocalFilteredLots({
        filter,
        sort,
        search,
      }),
    );
  }
  return dispatch(
    getLotsCommonAction({
      bucket,
      filter,
      sort,
      search,
      page,
      updateList,
    }),
  ).catch((error) => {
    const messageMap = {
      lotList: 'Request for lots failed ',
      inProgress: 'Request for lots failed ',
      inTransit: 'Request for lots failed ',
      completed: 'Request for lots failed ',
      distributed: 'Request for distributed lots failed.',
      globalSearch: 'Search lots failed.',
    };
    if (navigator) {
      setTimeout(() => {
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'warning',
            content: `${messageMap[bucket]}\n error: ${getCommonErrorMessage(error)}`,
          },
        });
      }, 400);
    }
    return Promise.reject(error);
  });
};

export const getDistributedLots = (navigator: RNNNavigator, page?: number) => (
  dispatch: Dispatch,
) => dispatch(getLotsCommonActionWithError({ bucket: 'distributed', navigator, page }));

export const getInProgressLotList = (navigator: RNNNavigator, page?: number) =>
  getLotsCommonActionWithError({
    navigator,
    bucket: 'inProgress',
    page,
  });

export const getInTransitLotList = (navigator: RNNNavigator, page?: number) =>
  getLotsCommonActionWithError({
    navigator,
    bucket: 'inTransit',
    page,
  });

export const getCompletedLotList = (navigator: RNNNavigator, page?: number) => dispatch =>
  dispatch(
    getLotsCommonActionWithError({
      navigator,
      bucket: 'completed',
      page,
    }),
  );

export const getMoreSearchResults = (query: string, navigator: RNNNavigator, page?: number) =>
  getLotsCommonActionWithError({
    navigator,
    bucket: 'globalSearch',
    page,
    search: query ? { search: query } : null,
  });
// -------------------------------------------------------
export const setCurrentLotList = (lotList: Array<Lot>) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_LOT_LIST,
    lotList,
  });
};

export const setMultiselectMode = (mode: ?string = 'distribute'): ThunkAction => (
  dispatch: Dispatch,
) => {
  // any validations ?
  dispatch({
    type: SET_MULTISELECT_MODE,
    active: true,
    multiselectType: mode,
  });
};

export const resetMultiselectMode = (): ThunkAction => (dispatch: Dispatch) => {
  dispatch({
    type: RESET_MULTISELECT_MODE,
  });
  dispatch({
    type: CLEAR_SELECTION,
  });
};

export const toggleSelection = (lotNumber: number) => ({
  type: TOGGLE_SELECTION,
  lotNumber,
});

const toggleSearchVisible = (visible: boolean, bucket: string) => ({
  type: TOGGLE_SEARCHBAR,
  visible,
  bucket,
});
export const showSearch = (bucket: string) => toggleSearchVisible(true, bucket);
export const hideSearch = (bucket: string) => toggleSearchVisible(false, bucket);
export const resetAllFilters = (bucket: string, navigator: RNNNavigator) => (dispatch) => {
  dispatch({ type: RESET_ALL_FILTERS, bucket });
  return dispatch(
    getLotsCommonAction({
      bucket,
      search: {},
      filter: {},
      sort: {},
    }),
  );
};

export const resetSearch = (bucket: string, navigator: Object) => (dispatch) => {
  dispatch(hideSearch(bucket));
  dispatch(setSearchQuery('', bucket, navigator));
};
// -------------------------------------------------------
export const setSearchQuery = (query: string, bucket: string, navigator: Object) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_QUERY,
    query,
    bucket,
  });
  return dispatch(
    getLotsCommonActionWithError({
      bucket,
      navigator,
      search: query ? { search: query } : null,
    }),
  );
};

export const setSelectedFilters = (
  selectedFilters: Object,
  totalCount: number,
  bucket: string,
  navigator: Object,
) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_LOT_FILTERS,
    selectedFilters,
    totalCount,
    bucket,
  });
  return dispatch(
    getLotsCommonActionWithError({
      bucket,
      navigator,
      filter: selectedFilters,
    }),
  );
};

export const toggleSortVisibility = (bucket: string) => ({ type: SORT_MODAL_VISIBLE, bucket });

export const toggleFilterVisibility = (bucket: string) => ({ type: FILTER_MODAL_VISIBLE, bucket });

export const handleSortChangeForLotList = (
  field: Object,
  bucket: string,
  navigator: Object,
) => (dispatch) => {
  dispatch({ type: HANDLE_SORT_CHANGE, selectedField: field, bucket });
  return dispatch(
    getLotsCommonActionWithError({
      bucket,
      navigator,
      sort: { sort_by: field },
    }),
  );
};

const navigateToAcknowledged = (tripId, navigator: RNNNavigator) => (dispatch) => {
  dispatch(tripActions.getAcknowledgedTrips({ navigator })).then((response) => {
    navigator.pop();
    setTimeout(() => {
      navigator.handleDeepLink({
        link: `acknowledged/${tripId}`,
        // payload: {} // optional to send extra params
      });
      dispatch({ type: TRIP_ACTION_RESPONDED });
    }, 300);
  });
};

export const acknowledgeTrip = (
  tripId: number,
  navigator: Object,
  shouldTransitionTab: boolean,
) => (dispatch: Function) => {
  if (shouldTransitionTab) {
    dispatch({ type: TRIP_ACTION_REQUESTED });
  }
  const tripIds = [tripId];
  return tripsService
    .tripAction(tripIds, 'acknowledge', {})
    .then((response: Object) => {
      if (response.status === 'success') {
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            content: '1 Trip has been Acknowledged!',
          },
          autoDismissTimerSec: 1,
        });
        // dispatch({ type: TRIP_ACTION_RESPONDED });
        if (shouldTransitionTab) {
          dispatch(navigateToAcknowledged(tripId, navigator));
        }
      }
      return response;
    })
    .catch((error: Object) => {
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          content: `Unable to Send Acknowledgement.\n ${getErrorMessage(error)}`,
        },
        autoDismissTimerSec: 1,
      });
      if (!shouldTransitionTab) {
        throw error; // send error to trip.action
      } else if (shouldTransitionTab) {
        dispatch({ type: TRIP_ACTION_RESPONDED });
      }
    });
};

const getSelectedAssignmentsIds = compose(
  map(head),
  filter(([assignmentId, selected]) => selected),
);
export const checkInLots = (selectedAssignments: Object, navigator: Object) => (
  dispatch: Dispatch,
) => {
  const dispatchAssignments = compose(getSelectedAssignmentsIds, toPairs)(selectedAssignments);
  lotlistService
    .transitionLotCommonService(dispatchAssignments, TRANSITION_ACTIONS.DROPOFF)
    .then((response) => {
      if (response.data.status === 'success') {
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: 'Lots successfully arrived',
          },
          autoDismissTimerSec: 1,
        });
        dispatch(resetMultiselectMode());
        dispatch(getInTransitLotList(navigator));
      }
    })
    .catch((error) => {
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          content: `Unable to perform action.\n ${getErrorMessage(error)}`,
        },
        autoDismissTimerSec: 1,
      });
    });
};

const getLots = propOr([], 'lots');
export const findTripWithId = (tripId: string) => find(propEq('tripId', tripId));

/**
 * @description Assign or distribute lots to a company or a driver
 * @param selectedLots: Object of lot ids mapped to true or false for selected and not;
 * @param assignee: Id of the user to which the @lots are being assigned
 * @param tripStatus: assigned/accepted ?
 * @param tripId: tripId for the lots being assigned
 * @param bucket: Where the lots came from. either 'assignedTrips' or 'acceptedTrips'
 * @param hasLotsLeft: whether the trip has any lots left
 * @param navigator: navigator object
 * @param goBackIfNoLots: called if hasLotsLeft is false
 * @return { message: 'success'} - If successful
 * @return { error: 'error message'} - If error
 */
export const assignLots = (
  selectedLots: Object,
  assignee: Object,
  tripStatus: string,
  tripId: ?string,
  bucket: string,
  hasLotsLeft: boolean,
  navigator: RNNNavigator,
  goBackIfNoLots: Function,
) => (dispatch: Dispatch) => {
  dispatch({ type: DISTRIBUTE_ASSIGNMENTS_REQUESTED });
  const dispatchAssignments = compose(getSelectedAssignmentsIds, toPairs)(selectedLots);
  lotlistService
    .distributeAssignments({ ...assignee, assignment_detail_ids: dispatchAssignments })
    .then((response) => {
      if (response.status === 200 && response.data.status === 'success') {
        const successNotification = () =>
          navigator.showInAppNotification({
            screen: 'CopartTransporter.ShowInAppNotification',
            passProps: {
              type: 'warning',
              content: 'Lot(s) distributed successfully!',
            },
            autoDismissTimerSec: 1.0,
          });
        if (!hasLotsLeft) {
          navigator.dismissModal();
          setTimeout(successNotification, 500);
          if (!goBackIfNoLots) {
            // eslint-disable-next-line no-console
            console.warn(
              'goBackIfNoLots: is null. This callback needs to be passed from lotlist screen',
            );
          } else {
            goBackIfNoLots();
          }
        } else {
          const getTripsAction =
            bucket === 'assignedTrips'
              ? tripActions.getAssignedTrips
              : tripActions.getAcknowledgedTrips;
          dispatch(getTripsAction({}))
            .then((trips) => {
              const lotList = compose(getLots, findTripWithId(tripId))(trips);
              return dispatch(setCurrentLotList(lotList));
            })
            .finally(() => {
              navigator.dismissModal();
              setTimeout(successNotification, 500);
            });
        }
      } else {
        // show appropriate notification
        navigator.dismissModal({
          animationType: 'slide-down',
        });
      }
    })
    .catch((error) => {
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: `Unable to assign.\n${JSON.stringify(error.response.data)}`,
        },
        autoDismissTimerSec: 1.0,
      });
      dispatch({ type: DISTRIBUTE_ASSIGNMENTS_RESPONDED });
    });
};
