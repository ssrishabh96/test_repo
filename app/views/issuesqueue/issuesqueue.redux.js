// @flow

import { createStructuredSelector } from 'reselect';
import { pathOr, sortWith, descend, prop } from 'ramda';

import { ReducerState } from './types';

import {
  initialState,
  //
  RESOLVE_ISSUE_ON_LOT,
  RESOLVE_ISSUE_ON_LOT_SUCCESS,
  RESOLVE_ISSUE_ON_LOT_FAILURE,
  //
  ISSUES_NEXT_PAGE_REQUESTED,
  ISSUES_NEXT_PAGE_SUCCESS,
  //
  REQUEST_MARK_ISSUE_READ,
  REQUEST_MARK_ISSUE_READ_FAILURE,
  //
  REQUEST_ISSUE_LOT_DETAIL,
  REQUEST_ISSUE_LOT_DETAIL_SUCCESS,
  REQUEST_ISSUE_LOT_DETAIL_FAILURE,
  //
  SET_SEARCH_QUERY_ISSUE_TRIPS,
  TOGGLE_SEARCHBAR_ISSUE_TRIPS,
  //
  ISSUES_LIST_REQUESTED,
  REQUEST_ISSUES_LIST_SUCCESS,
  REQUEST_ISSUES_LIST_FAILURE,
  //
  DISTRIBUTE_ISSUE_LOT_REQUESTED,
  DISTRIBUTE_ISSUE_LOT_SUCCESS,
  DISTRIBUTE_ISSUE_LOT_FAILED,
  //
} from './issuesqueue.constants';

const sortByCreatedTime = sortWith([descend(prop('created_at'))]);

const issuesQueueReducer = (state: ReducerState = initialState, action: Object) => {
  switch (action.type) {
    case REQUEST_MARK_ISSUE_READ:
    case RESOLVE_ISSUE_ON_LOT:
    case REQUEST_ISSUE_LOT_DETAIL:
    case ISSUES_LIST_REQUESTED:
    case DISTRIBUTE_ISSUE_LOT_REQUESTED:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.listType]: true,
        },
        error: null,
      };
    case REQUEST_ISSUES_LIST_SUCCESS:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.listType]: false,
        },
        totalCount: {
          ...state.totalCount,
          [action.listType]: action.count,
        },
        page: {
          ...state.page,
          [action.listType]: 1,
        },
        unsortedList: {
          ...state.unsortedList,
          [action.listType]: action.data,
        },
        [action.listType]: sortByCreatedTime(action.data),
        error: null,
      };
    case ISSUES_NEXT_PAGE_REQUESTED:
      return {
        ...state,
        isLoadingNextPage: {
          ...state.isLoadingNextPage,
          [action.listType]: true,
        },
        error: null,
      };
    case ISSUES_NEXT_PAGE_SUCCESS: {
      return {
        ...state,
        isLoadingNextPage: {
          ...state.isLoadingNextPage,
          [action.listType]: false,
        },
        totalCount: {
          ...state.totalCount,
          [action.listType]: action.count,
        },
        page: {
          ...state.page,
          [action.listType]: action.page,
        },
        unsortedList: {
          ...state.unsortedList,
          [action.listType]: action.data,
        },
        error: false,
        [action.listType]: sortByCreatedTime(action.data),
      };
    }

    case REQUEST_ISSUE_LOT_DETAIL_SUCCESS: {
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          raisedByMe: false,
        },
        lotDetail: action.data,
      };
    }

    case REQUEST_ISSUE_LOT_DETAIL_FAILURE: {
      return {
        ...state,
        lotDetail: null,
        isLoading: {
          ...state.isLoading,
          raisedByMe: false,
        },
        isLoadingNextPage: {
          ...state.isLoading,
          raisedByMe: false,
        },
      };
    }

    case DISTRIBUTE_ISSUE_LOT_SUCCESS:
      return {
        ...state,
        lotDetail: null,
        isLoading: {
          ...state.isLoading,
          assigned: false,
        },
      };
    case REQUEST_MARK_ISSUE_READ_FAILURE:
    case RESOLVE_ISSUE_ON_LOT_FAILURE:
    case RESOLVE_ISSUE_ON_LOT_SUCCESS:
    case REQUEST_ISSUES_LIST_FAILURE:
    case DISTRIBUTE_ISSUE_LOT_FAILED:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.listType]: false,
        },
        isLoadingNextPage: {
          ...state.isLoadingNextPage,
          [action.listType]: false,
        },
        error: action.error,
      };
    case SET_SEARCH_QUERY_ISSUE_TRIPS: {
      return {
        ...state,
        searchMode: {
          ...state.searchMode,
          [action.listType]: {
            ...state[action.listType],
            search: {
              ...state.searchMode[action.listType].search,
              query: action.query,
            },
          },
        },
      };
    }

    case TOGGLE_SEARCHBAR_ISSUE_TRIPS: {
      return {
        ...state,
        searchMode: {
          ...state.searchMode,
          [action.listType]: {
            ...state[action.listType],
            search: {
              ...state.searchMode[action.listType].search,
              visible: action.visible,
            },
          },
        },
      };
    }

    default:
      return state;
  }
};

const getIsLoading = pathOr(false, ['issuesqueue', 'isLoading']);
const getRaisedByMeQueue = pathOr([], ['issuesqueue', 'raisedByMe']);
const getAssignedToMe = pathOr([], ['issuesqueue', 'assignedToMe']);
const getError = pathOr(null, ['issuesqueue', 'error']);
const getLotDetail = pathOr(null, ['issuesqueue', 'lotDetail']);
const getPartialTrips = pathOr([], ['issuesqueue', 'issueLots']);
// const getRaisedLots = pathOr({}, ['issuesqueue', 'raised']);
// const getAssignedLots = pathOr({}, ['issuesqueue', 'assigned']);
// const getIssueLots = pathOr({}, ['issuesqueue', 'issueLots']);
const getSearchResults = pathOr({}, ['issuesqueue', 'searchMode']);
const getIsLoadingNextPage = pathOr({}, ['issuesqueue', 'isLoadingNextPage']);
const getPage = pathOr({}, ['issuesqueue', 'page']);
const getTotalCount = pathOr({}, ['issuesqueue', 'totalCount']);

export const issuesLotListSelector = createStructuredSelector({
  isLoading: getIsLoading,
  isLoadingNextPage: getIsLoadingNextPage,
  page: getPage,
  error: getError,
  raisedByMe: getRaisedByMeQueue,
  assignedToMe: getAssignedToMe,
  partialTripLots: getPartialTrips,
  lotDetail: getLotDetail,
  searchResults: getSearchResults,
  totalCount: getTotalCount,
});

export default issuesQueueReducer;
