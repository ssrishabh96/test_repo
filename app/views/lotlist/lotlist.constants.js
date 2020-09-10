import { ReducerState } from './types';

export const lotList = {
  isLoading: false,
  isLoadingNextPage: false,
  lots: [],
  filteredLots: [],
  count: 0,
  filters: {
    selectedFilters: {},
    totalCount: 0,
    isVisible: false,
  },
  sort: {
    isModalVisible: false,
    selectedField: {},
  },
  search: {
    query: '',
    visible: false,
  },
  page: 1, // 1 ?
};

export const initialState: ReducerState = {
  trip: null,
  multiselect: {
    active: false,
    type: '', // distribute
  },
  selectedLots: {}, // (new Map(): Map<number, boolean>),
  isLoading: false,
  error: null,
  lotList,
  inProgress: lotList,
  inTransit: lotList,
  completed: lotList,
  distributed: lotList,
  globalSearch: lotList,
  search: {
    isSearchBarVisible: false,
    result: [],
  },
  cache: {
    // assignmentDetailId: {
    //   notes: [],
    //   charges: {},
    // },
  },
};

// fetch lots actions
export const FETCH_LOTS_INIT = 'FETCH_LOTS_INIT';
export const FETCH_LOTS_SUCCESS = 'FETCH_LOTS_SUCCESS';
export const FETCH_LOTS_FAILURE = 'FETCH_LOTS_FAILURE';

export const DISTRIBUTED_LOTS_REQUESTED = 'DISTRIBUTED_LOTS_REQUESTED';
export const DISTRIBUTED_LOTS_LOADED = 'DISTRIBUTED_LOTS_LOADED';
export const DISTRIBUTED_LOTS_FAILED = 'DISTRIBUTED_LOTS_FAILED';

export const CURRENT_LOT_LIST_LOADING = 'CURRENT_LOT_LIST_LOADING';
export const SET_CURRENT_LOT_LIST = 'SET_CURRENT_LOT_LIST';
export const SET_FILTERED_LOT_LIST = 'SET_FILTERED_LOT_LIST';
export const CLEAR_CURRENT_LOT_LIST = 'CLEAR_CURRENT_LOT_LIST';
export const UPDATE_LOT_LIST_BY_TYPE = 'UPDATE_LOT_LIST_BY_TYPE';
export const UPDATE_LOT_LIST_AFTER_CHECKIN = 'UPDATE_LOT_LIST_AFTER_CHECKIN';
// navbar actions
export const SET_MULTISELECT_MODE = 'LOTLIST/SET_MULTISELECT_MODE';
export const RESET_MULTISELECT_MODE = 'LOTLIST/RESET_MULTISELECT_MODE';
export const FILTER_WITH_QUERY = 'FILTER_WITH_QUERY';
export const RESET_ALL_FILTERS = 'RESET_ALL_FILTERS';

export const TOGGLE_SEARCHBAR = 'TOGGLE_SEARCHBAR_LOT';
export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY_LOT';

export const CACHE_LOT_INFO = 'CACHE_LOT_INFO';
export const REMOVE_LOT_INFO_FROM_CACHE = 'REMOVE_LOT_INFO_FROM_CACHE';

// split lots actions
export const TOGGLE_SELECTION = 'LOTLIST/TOGGLE_SELECTION';
export const CLEAR_SELECTION = 'LOTLIST/CLEAR_SELECTION';

export const LOTLIST_REQUESTED = 'LOTLIST_REQUESTED';
export const LOTLIST_LOADED = 'LOTLIST_LOADED';
export const LOTLIST_FAILED = 'LOTLIST_FAILED';

export const TRIP_ACTION_REQUESTED = 'TRIP_ACTION_REQUESTED';
export const TRIP_ACTION_RESPONDED = 'TRIP_ACTION_RESPONDED';

export const ADD_TO_INPROGRESS = 'LOTLIST/ADD_TO_INPROGRESS';
export const ADD_TO_INTRANSIT = 'LOTLIST/ADD_TO_INTRANSIT';

// add issue to lot actions
// TODO: Add namespacing for all lotlist types for better debugging ?
// export const INPROGRESS_SUBMIT_ISSUE_INIT = 'INPROGRESS/SUBMIT_ISSUE_INIT';
// export const INPROGRESS_SUBMIT_ISSUE_FAILURE = 'INPROGRESS/SUBMIT_ISSUE_FAILURE';
// export const INPROGRESS_SUBMIT_ISSUE_SUCCESS = 'INPROGRESS/SUBMIT_ISSUE_SUCCESS';

export const SUBMIT_ISSUE_INIT = 'SUBMIT_ISSUE_INIT';
export const SUBMIT_ISSUE_FAILURE = 'SUBMIT_ISSUE_FAILURE';
export const SUBMIT_ISSUE_SUCCESS = 'SUBMIT_ISSUE_SUCCESS';

export const UPDATE_LOT_LIST_AFTER_CLEAR_ISSUE = 'UPDATE_LOT_LIST_AFTER_CLEAR_ISSUE';
export const UPDATE_LOT_LIST_AFTER_CHANGE_DRIVER = 'UPDATE_LOT_LIST_AFTER_CHANGE_DRIVER';

export const UPDATE_INTRANSIT_LIST = 'LOTLIST/UPDATE_INTRANSIT_LIST';
export const UPDATE_COMPLETED_LIST = 'LOTLIST/UPDATE_COMPLETED_LIST';

export const SET_SELECTED_LOT_FILTERS = 'SET_SELECTED_LOT_FILTERS';

export const HANDLE_SORT_CHANGE = 'HANDLE_SORT_LOT_CHANGE';
export const SORT_MODAL_VISIBLE = 'LOT_SORT_MODAL_VISIBLE';
export const FILTER_MODAL_VISIBLE = 'LOT_FILTER_MODAL_VISIBLE';

export const LOTLIST_NEXTPAGE_LOADED = 'LOTLIST_NEXTPAGE_LOADED';
export const LOTLIST_NEXTPAGE_REQUESTED = 'LOTLIST_NEXTPAGE_REQUESTED';
