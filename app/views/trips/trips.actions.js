// @flow

import type { Trip } from 'types/Trip';

import {
  propOr,
  propEq,
  map,
  find,
  compose,
  pickBy,
  equals,
  keys,
  evolve,
  assoc,
  pathOr,
  isEmpty,
  ifElse,
  __,
  unless,
  join,
  head,
  values,
  filter,
  identity,
} from 'ramda';
import {
  TRIPS_REQUESTED,
  TRIPS_LOADED,
  TRIPS_FAILED,
  SET_MULTISELECT_MODE,
  RESET_MULTISELECT_MODE,
  TOGGLE_SELECTION,
  SET_MULTISELECT_GROUP,
  CLEAR_SELECTION,
  SET_SELECTED_FILTERS,
  TRIP_FILTER_MODAL_VISIBLE,
  RESET_ALL_TRIP_FILTERS,
  // UPDATE_TRIP_BY_TYPE,
  UPDATE_TRIP_WITH_ISSUE,
  TOGGLE_SEARCHBAR,
  SET_SEARCH_QUERY,
  TRIP_ACTION_REQUESTED,
  TRIP_ACTION_RESPONDED,
  HANDLE_SORT_CHANGE,
  MODAL_VISIBLE,
  //
  DISTRIBUTE_TRIPS_REQUESTED,
  DISTRIBUTE_TRIPS_RESPONDED,
  DISTRIBUTE_TRIPS_FAILED,
  TRIPLIST_NEXTPAGE_LOADED,
  TRIPS_NEXTPAGE_REQUESTED,
} from './trips.constants';

import {
  DISTRIBUTE_ASSIGNMENTS_REQUESTED,
  DISTRIBUTE_ASSIGNMENTS_RESPONDED,
} from 'views/assigntolist/assigntolist.constants';

import { /* LOT_STATUSES, TRANSITION_ACTIONS, */ bucketToStatusMap } from 'constants/Lot';
import { GROUP_MANAGER } from 'constants/user/roles';
import { mergePageIntoList } from 'utils';

import * as tripsService from './trips.service';
import * as lotlistService from '../lotlist/lotlist.service';

import { setCurrentLotList /* acknowledgeAssignments */ } from '../lotlist/lotlist.action';

import {
  // flattenLots,
  // removeMultipleLotsFromTrip,
  getSelectedLotsFromTrips,
  // getUnselectedTrips,
  removeLotForTrip,
  prepareParams,
} from './helpers/tripHelpers';
import { getUserRole } from 'views/login/login.redux';
import { prepareParams2, defaultToState } from 'views/lotlist/lotlist.helper';

import { LotItemType } from '../lotlist/components/LotItem/types';
import { TripType } from '../trips/types';
import { fetchAssignedDeclinedTrips } from 'views/declinedtrips/declinedtriplist.actions';

const emptyObject = () => ({});
const prepareSearch = ifElse(isEmpty, emptyObject, assoc('search', __, {}));
const prepareSort = ifElse(isEmpty, emptyObject, assoc('sort_by', __, {}));

const getErrors = pathOr([], ['response', 'data', 'errors']);
const combineMessages = compose(join(' | '), head);
const getErrorMessage = compose(unless(isEmpty, combineMessages), values, head, getErrors);

export const getAssignedTrips = ({ filters, sort, search, page, navigator }) => dispatch =>
  dispatch(getTripsCommonAction({ filters, sort, search, page, navigator, bucket: 'assigned' }));

export const getAcknowledgedTrips = ({ filters, sort, search, page, navigator }) => dispatch =>
  dispatch(getTripsCommonAction({ filters, sort, search, page, navigator, bucket: 'accepted' }));

export const getDistributedTrips = (navigator, page) => dispatch =>
  dispatch(getTripsCommonAction({ navigator, page, bucket: 'distributed' }));

// export const getDeclinedSearchTrips = ({ filters, sort, search, navigator }) => dispatch =>
//   dispatch(getSearchedTripsDeclined({ filters, sort, search, navigator, bucket: 'declined' }));

type getTripsCommonActionParams = {
  bucket: 'assigned' | 'accepted' | 'distributed',
  filter?: { [string]: string[] } | undefined,
  sort?: { [string]: 'asc' | 'desc' } | undefined,
  search?: { query: string } | undefined,
  page?: number,
};
const getTripsCommonAction = ({
  filters,
  sort,
  search,
  navigator,
  bucket,
  page = 1,
}: getTripsCommonActionParams) => (dispatch: Function, getState: Function): ?Array<Trip> => {
  const page_size = 20;
  const totalCount = getState().trips[bucket].count;
  if (page === 1 || (page - 1) * page_size < totalCount) {
    if (page === 1) dispatch({ type: TRIPS_REQUESTED, bucket });
    if (page > 1) dispatch({ type: TRIPS_NEXTPAGE_REQUESTED, bucket });
    // console.log(`??? getting ${bucket} page `, page);
    const defaultParams = { page, page_size };

    const pickedSearch = defaultToState(
      search,
      prepareSearch(getState().trips[bucket].search.query),
    );
    const pickedFilter = defaultToState(filters, getState().trips[bucket].filters.selectedFilters);
    const pickedSort = defaultToState(
      sort,
      prepareSort(getState().trips[bucket].sort.selectedField),
    );
    const params = prepareParams2({
      bucket,
      search: pickedSearch,
      filter: pickedFilter,
      sort: pickedSort,
    });

    return tripsService
      .getTripsCommonService({ ...defaultParams, ...params })
      .then((data) => {
        const trips = data.trips;
        const count = data.count || trips.length;
        if (page === 1) {
          dispatch({ type: TRIPS_LOADED, trips, bucket, count });
        } else {
          const existingTrips = getState().trips[bucket].trips;
          const mergedTrips = mergePageIntoList(existingTrips, trips, page, page_size);
          dispatch({
            type: TRIPLIST_NEXTPAGE_LOADED,
            bucket,
            trips: mergedTrips,
            count,
            page,
          });
        }
        return trips;
      })
      .catch((error) => {
        console.log(error);
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: `${error.response.data.parsedErrorMessage}`,
          },
        });
        dispatch({ type: TRIPS_FAILED, error, bucket });
      });
  }
  return Promise.resolve();
};

export const tripAction = (
  selectedTrips: Array<string>,
  action: 'acknowledge' | 'decline',
  params: Object,
  navigator: Object,
  goBack: Function,
) => (dispatch: Function) => {
  const tripIds = map(parseInt)(selectedTrips);
  dispatch({ type: TRIP_ACTION_REQUESTED });
  return tripsService
    .tripAction(tripIds, action, params)
    .then((response: Object) => {
      if (response.status === 'success') {
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: `${tripIds.length > 0 ? 'Trips' : 'Trip'} successfuly ${
              action === 'acknowledge' ? 'acknowledged' : 'rejected'
            }!`,
          },
          autoDismissTimerSec: 1.0,
        });
        dispatch(getAssignedTrips({ navigator }));
        dispatch(resetMultiselectMode());
      } else {
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: `Problems ${action === 'acknowledge' ? 'acknowledging' : 'rejecting!'} ${
              tripIds.length > 0 ? 'trips' : 'trip'
            }!`,
          },
          autoDismissTimerSec: 1.0,
        });
      }
      dispatch({ type: TRIP_ACTION_RESPONDED });
      if (goBack) {
        goBack();
      }
    })
    .catch((error: Object) => {
      console.log('error in ws: ', error);
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: `Error in WS: ${JSON.stringify(error)}`,
        },
        autoDismissTimerSec: 1.0,
      });
      dispatch(resetMultiselectMode());
      dispatch({ type: TRIP_ACTION_RESPONDED });
      if (goBack) {
        goBack();
      }
    });
};

/*
export const acknowledgeTrips = (selectedTrips, resetMultiselect, navigator: Object) => (
  dispatch,
  getState,
) => {
  const { assigned } = getState().trips;
  const trips = filter(trip => selectedTrips[trip.tripId])(assigned.trips || []);
  const lots = flattenLots(trips);
  const dispatchAssignments = map(propOr('', 'dispatch_assignment_detail_id'))(lots);
  // TODO we may use this notification message
  // const content =
  // selectedTrips.length === 1
  //   ? `Trip #${selectedTrips[0]} acknowledged`
  //   : `Trip #${selectedTrips[0]} + ${selectedTrips.length - 1} more acknowledged`;
  dispatch({ type: TRIP_ACTION_REQUESTED });
  dispatch(acknowledgeAssignments(dispatchAssignments, trips.length, navigator, false))
    .then((response) => {
      if (response.data.status === 'success') {
        dispatch(getAssignedTrips({ navigator }));
        if (resetMultiselect) {
          dispatch(resetMultiselectMode());
        }
      }
    })
    .catch((error) => {
      dispatch({ type: TRIP_ACTION_RESPONDED });
    });
};
*/

export const distributeTrips = (
  assignee: Object,
  trips: Object,
  comingFrom: String,
  navigator: Object,
) => (dispatch: Function) => {
  dispatch({ type: DISTRIBUTE_TRIPS_REQUESTED });
  const tripIds = compose(map(parseInt), getTripsFromSelected)(trips);
  const data = {
    trip_ids: tripIds,
    ...assignee,
  };
  tripsService
    .distributeTrips(data)
    .then((response: Object) => {
      if (response.status === 200 && response.data.status === 'success') {
        dispatch({ type: DISTRIBUTE_TRIPS_RESPONDED });
        navigator.dismissModal();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: 'Trip(s) distributed successfully!',
          },
          autoDismissTimerSec: 1.0,
        });
        if (comingFrom === 'declinedTrip') {
          navigator.handleDeepLink({
            link: 'popTo/declinedTripList',
          });
          dispatch(fetchAssignedDeclinedTrips(navigator));
        }
      } else {
        dispatch({ type: DISTRIBUTE_TRIPS_FAILED });
        navigator.dismissModal();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: `Unable to distribute.\n${JSON.stringify(response.data)}`,
          },
          autoDismissTimerSec: 1.0,
        });
      }
    })
    .catch((error: Object) => {
      dispatch({ type: DISTRIBUTE_TRIPS_FAILED });
      navigator.dismissModal();
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: `Unable to distribute.\n${JSON.stringify(error.response.data)}`,
        },
        autoDismissTimerSec: 1.0,
      });
    });
};

export const assignTrips = (
  assignee: Object,
  trips: Array,
  selected: Object,
  tripType: string,
  navigator: Object,
) => (dispatch) => {
  const isInSelected = id => selected[id];
  const selectedLots = getSelectedLotsFromTrips(isInSelected)(trips);
  const dispatchAssignments = map(propOr('', 'dispatch_assignment_detail_id'))(selectedLots);
  dispatch({ type: DISTRIBUTE_ASSIGNMENTS_REQUESTED });
  lotlistService
    .distributeAssignments({ ...assignee, assignment_detail_ids: dispatchAssignments })
    .then((response) => {
      if (response.status === 200 && response.data.status === 'success') {
        // dispatch({ type: 'DISTRIBUTE_ASSIGNMENTS_RESPONDED' });
        navigator.dismissModal();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'warning',
            content: 'Lots Successfully Assigned.',
          },
          autoDismissTimerSec: 1.0,
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

export const removeLotFromTrip = (lot: LotItemType, lotBucket: string) => (dispatch, getState) => {
  const allTripsByLotBucket: Array<TripType> = getState().trips[lotBucket];
  const updatedLot = {
    ...lot,
    issue: {},
  };
  const updatedTripsByLotBucket = removeLotForTrip(updatedLot)(allTripsByLotBucket);
  dispatch({
    type: UPDATE_TRIP_WITH_ISSUE, // TODO: Use proper constant
    updatedTrip: updatedTripsByLotBucket,
    lotBucket,
  });
  // const updatedLotList = getLotById(lot.number)(updatedTripsByLotBucket);
  const updatedTrip: TripType = find(propEq('tripId', lot.tripId))(updatedTripsByLotBucket);

  dispatch(setCurrentLotList((updatedTrip && updatedTrip.lots) || []));
};

export const toggleModal = (bucket: string) => (dispatch: Dispatch) => {
  dispatch({ type: MODAL_VISIBLE, bucket });
};

export const toggleFilterVisibility = (bucket: string) => (dispatch: Dispatch) => {
  dispatch({ type: TRIP_FILTER_MODAL_VISIBLE, bucket });
};

export const handleSortChangeForLotList = (
  field: string,
  bucket: string,
  navigator: Object,
) => (dispatch) => {
  dispatch({ type: HANDLE_SORT_CHANGE, selectedField: field, bucket });
  return dispatch(getTripsCommonAction({ bucket, sort: { sort_by: field }, navigator }));
};

export const setMultiselectMode = type => (dispatch) => {
  // any validations ?
  dispatch({
    type: SET_MULTISELECT_MODE,
    active: true,
    group: null,
    multiselectType: type,
  });
};

export const resetMultiselectMode = () => (dispatch) => {
  dispatch({
    type: RESET_MULTISELECT_MODE,
  });
  dispatch({
    type: CLEAR_SELECTION,
  });
};

export const toggleSelection = (id, selectedGroup) => (dispatch, getState) => {
  const type = getState().trips.multiselect.type;
  const role = getUserRole(getState());
  if (type === 'distribute' && role === GROUP_MANAGER) {
    const group = getState().trips.multiselect.group;
    const selected = getState().trips.selected;
    const selectedCount = filter(identity)(values(getState().trips.selected)).length;

    if (!group) {
      dispatch({ type: SET_MULTISELECT_GROUP, group: selectedGroup });
    }
    if (selectedCount === 1 && selected[id]) {
      dispatch({ type: SET_MULTISELECT_GROUP, group: null });
    }
  }
  return dispatch({ type: TOGGLE_SELECTION, id });
};

const toggleSearchVisible = (visible: boolean, bucket: string) => ({
  type: TOGGLE_SEARCHBAR,
  visible,
  bucket,
});
export const showSearch = (bucket: string) => toggleSearchVisible(true, bucket);
export const hideSearch = (bucket: string) => toggleSearchVisible(false, bucket);
export const resetSearch = (bucket: string, navigator) => (dispatch) => {
  dispatch(hideSearch(bucket));
  return dispatch(setSearchQuery('', bucket, navigator));
};

export const setSearchQuery = (query: string, bucket: string, navigator: Object) => (
  dispatch,
  getState,
) => {
  dispatch({
    type: SET_SEARCH_QUERY,
    query,
    bucket,
  });
  return dispatch(
    getTripsCommonAction({ bucket, search: query ? { search: query } : null, navigator }),
  );
};

export const setSelectedFilters = (
  selectedFilters: Object,
  totalCount: number,
  bucket: string,
  navigator: Object,
) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_FILTERS,
    selectedFilters,
    totalCount,
    bucket,
  });
  return dispatch(getTripsCommonAction({ bucket, filters: selectedFilters, navigator }));
};

export const resetAllFilters = (bucket: string, navigator: Object) => (dispatch) => {
  dispatch({ type: RESET_ALL_TRIP_FILTERS, bucket });
  dispatch(getTripsCommonAction({ filters: {}, sort: {}, search: {}, navigator, bucket }));
};

const setTripStatusToAccepted = compose(
  assoc('tripStatus', 'accepted'),
  evolve({
    lots: map(assoc('status', 'accepted')), // update the lot status for all the lots in that trip
  }),
);
export const getTripsFromSelected = compose(keys, pickBy(equals(true)));
