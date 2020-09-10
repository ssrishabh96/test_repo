// @flow

import { createStructuredSelector } from 'reselect';
import { pathOr, sortWith, descend, prop } from 'ramda';

import {
  initialState,
  //
  DECLINED_LIST_REQUESTED,
  REQUEST_DECLINED_LIST_SUCCESS,
  REQUEST_DECLINED_LIST_FAILED,
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
} from './declinedtriplist.constants';

const sortByCreatedTime = sortWith([descend(prop('createdAt'))]);

const declinedTripsListReducer = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case REMOVE_PERSONNEL_REQUESTED:
    case DECLINED_LIST_REQUESTED:
    case TAKE_TRIP_BACK_REQUESTED:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.listType]: true,
        },
        error: null,
      };
    case REQUEST_DECLINED_LIST_SUCCESS: {
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
        error: false,
        [action.listType]: sortByCreatedTime(action.data),
      };
    }
    case REQUEST_DECLINED_TRIPS_NEXTPAGE_REQUESTED:
      return {
        ...state,
        isLoadingNextPage: {
          ...state.isLoadingNextPage,
          [action.listType]: true,
        },
        error: false,
      };
    case REQUEST_DECLINED_TRIPS_NEXTPAGE_SUCCESS:
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
        error: false,
        [action.listType]: action.data,
      };
    case REQUEST_DECLINED_LIST_FAILED:
    case TAKE_TRIP_BACK_SUCCESS:
    case TAKE_TRIP_BACK_FAILURE: {
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.listType]: false,
        },
        isLoadingNextPage: {
          ...state.isLoadingNextPage,
          [action.listType]: true,
        },
        error: action.error,
      };
    }

    case REMOVE_PERSONNEL_SUCCESS: {
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          assignedToMe: false,
        },
        error: null,
      };
    }

    case REMOVE_PERSONNEL_FAILURE: {
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          assignedToMe: false,
        },
        error: action.error,
      };
    }

    case SET_SEARCH_QUERY_DECLINED_TRIPS: {
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

    case TOGGLE_SEARCHBAR_DECLINED_TRIPS: {
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

const getIsLoading = pathOr(false, ['declinedtriplist', 'isLoading']);
const getPage = pathOr(false, ['declinedtriplist', 'page']);
const getIsLoadingNextPage = pathOr(false, ['declinedtriplist', 'isLoadingNextPage']);
const getError = pathOr(false, ['declinedtriplist', 'error']);
const getAssignedToMeList = pathOr(false, ['declinedtriplist', 'assignedToMe']);
const getRaisedByMeList = pathOr(false, ['declinedtriplist', 'raisedByMe']);
const getSearchResults = pathOr({}, ['declinedtriplist', 'searchMode']);
const getTotalCount = pathOr({}, ['declinedtriplist', 'totalCount']);

export const declinedTripsListSelector = createStructuredSelector({
  isLoading: getIsLoading,
  isLoadingNextPage: getIsLoadingNextPage,
  totalCount: getTotalCount,
  error: getError,
  page: getPage,
  raisedByMe: getRaisedByMeList,
  assignedToMe: getAssignedToMeList,
  searchResults: getSearchResults,
});

export default declinedTripsListReducer;
