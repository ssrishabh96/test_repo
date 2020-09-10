// @flow

const searchModeTripList = {
  trips: [],
  search: {
    query: '',
    visible: false,
  },
};

export const initialState = {
  raisedByMe: [],
  assignedToMe: [],
  isLoading: {
    raisedByMe: false,
    assignedToMe: false,
  },
  isLoadingNextPage: {
    raisedByMe: false,
    assignedToMe: false,
  },
  totalCount: {
    raisedByMe: 0,
    assignedToMe: 0,
  },
  page: {
    raisedByMe: 1,
    assignedToMe: 1,
  },
  error: null,
  searchMode: {
    raisedByMe: searchModeTripList,
    assignedToMe: searchModeTripList,
  },
};

export const DECLINED_LIST_REQUESTED = 'DECLINED_LIST_REQUESTED';
export const REQUEST_DECLINED_LIST_SUCCESS = 'REQUEST_DECLINED_LIST_SUCCESS';
export const REQUEST_DECLINED_LIST_FAILED = 'REQUEST_DECLINED_LIST_FAILED';

export const OVERRIDE_TRIP_REJECTION_REQUESTED = 'OVERRIDE_TRIP_REJECTION_REQUESTED';
export const OVERRIDE_TRIP_REJECTION_SUCCESS = 'OVERRIDE_TRIP_REJECTION_SUCCESS';
export const OVERRIDE_TRIP_REJECTION_FAILURE = 'OVERRIDE_TRIP_REJECTION_FAILURE';

export const REMOVE_PERSONNEL_REQUESTED = 'REMOVE_PERSONNEL_REQUESTED';
export const REMOVE_PERSONNEL_SUCCESS = 'REMOVE_PERSONNEL_SUCCESS';
export const REMOVE_PERSONNEL_FAILURE = 'REMOVE_PERSONNEL_FAILURE';

export const TAKE_TRIP_BACK_REQUESTED = 'TAKE_TRIP_BACK_REQUESTED';
export const TAKE_TRIP_BACK_SUCCESS = 'TAKE_TRIP_BACK_SUCCESS';
export const TAKE_TRIP_BACK_FAILURE = 'TAKE_TRIP_BACK_FAILURE';

export const SET_SEARCH_QUERY_DECLINED_TRIPS = 'SET_SEARCH_QUERY_DECLINED_TRIPS';
export const TOGGLE_SEARCHBAR_DECLINED_TRIPS = 'TOGGLE_SEARCHBAR_DECLINED_TRIPS';

export const REQUEST_DECLINED_TRIPS_NEXTPAGE_REQUESTED =
  'REQUEST_DECLINED_TRIPS_NEXTPAGE_REQUESTED';
export const REQUEST_DECLINED_TRIPS_NEXTPAGE_SUCCESS = 'REQUEST_DECLINED_TRIPS_NEXTPAGE_SUCCESS';
