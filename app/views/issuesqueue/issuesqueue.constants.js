// @flow

const searchModeTripList = {
  trips: [],
  search: {
    query: '',
    visible: false,
  },
};

export const initialState = {
  isLoading: {
    raisedByMe: false,
    assignedToMe: false,
    issueLots: false,
  }, // TODO: Keep it here or Move it to the root reducer ?
  isLoadingNextPage: {
    raisedByMe: false,
    assignedToMe: false,
    issueLots: false,
  },
  totalCount: {
    raisedByMe: 0,
    assignedToMe: 0,
    issueLots: 0,
  },
  page: {
    raisedByMe: 1,
    assignedToMe: 1,
    issueLots: 1,
  },
  unsortedList: {
    raisedByMe: [],
    assignedToMe: [],
    issueLots: [],
  },
  error: null, // TODO: Keep it here or Move it to the root reducer ?
  raisedByMe: [],
  assignedToMe: [],
  issueLots: [],
  lotDetail: null,
  searchMode: {
    raisedByMe: searchModeTripList,
    assignedToMe: searchModeTripList,
    issueLots: searchModeTripList,
  },
};

// load issues lot list actions
export const ISSUES_LIST_REQUESTED = 'ISSUES_LIST_REQUESTED';
export const REQUEST_ISSUES_LIST_SUCCESS = 'ISSUES_LIST_SUCCESS';
export const REQUEST_ISSUES_LIST_FAILURE = 'REQUEST_ISSUES_LIST_FAILURE';

export const ISSUES_NEXT_PAGE_REQUESTED = 'ISSUES_NEXT_PAGE_REQUESTED';
export const ISSUES_NEXT_PAGE_SUCCESS = 'ISSUES_NEXT_PAGE_SUCCESS';

// fetch issue lot detail
export const REQUEST_ISSUE_LOT_DETAIL = 'REQUEST_ISSUE_LOT_DETAIL';
export const REQUEST_ISSUE_LOT_DETAIL_SUCCESS = 'REQUEST_ISSUE_LOT_DETAIL_SUCCESS';
export const REQUEST_ISSUE_LOT_DETAIL_FAILURE = 'REQUEST_ISSUE_LOT_DETAIL_FAILURE';

// read inactive issue notes
export const REQUEST_MARK_ISSUE_READ = 'REQUEST_MARK_ISSUE_READ';
export const REQUEST_MARK_ISSUE_READ_SUCCESS = 'REQUEST_MARK_ISSUE_READ_SUCCESS';
export const REQUEST_MARK_ISSUE_READ_FAILURE = 'REQUEST_MARK_ISSUE_READ_FAILURE';

// resolve issue constants
export const RESOLVE_ISSUE_ON_LOT = 'RESOLVE_ISSUE_ON_LOT';
export const RESOLVE_ISSUE_ON_LOT_SUCCESS = 'RESOLVE_ISSUE_ON_LOT_SUCCESS';
export const RESOLVE_ISSUE_ON_LOT_FAILURE = 'RESOLVE_ISSUE_ON_LOT_FAILURE';

export const ESCALATE_ISSUE_INIT = 'ESCALATE_ISSUE_INIT';
export const ESCALATE_ISSUE_SUCCESS = 'ESCALATE_ISSUE_SUCCESS';
export const ESCALATE_ISSUE_ERROR = 'ESCALATE_ISSUE_ERROR';

export const SET_SEARCH_QUERY_ISSUE_TRIPS = 'SET_SEARCH_QUERY_ISSUE_TRIPS';
export const TOGGLE_SEARCHBAR_ISSUE_TRIPS = 'TOGGLE_SEARCHBAR_ISSUE_TRIPS';

export const DISTRIBUTE_ISSUE_LOT_REQUESTED = 'DISTRIBUTE_ISSUE_LOT_REQUESTED';
export const DISTRIBUTE_ISSUE_LOT_SUCCESS = 'DISTRIBUTE_ISSUE_LOT_SUCCESS';
export const DISTRIBUTE_ISSUE_LOT_FAILED = 'DISTRIBUTE_ISSUE_LOT_FAILED';
