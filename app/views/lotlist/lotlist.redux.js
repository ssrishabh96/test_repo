// @flow

import { pathOr, assoc, mergeDeepRight, path, dissoc, slice } from 'ramda';
import { createStructuredSelector } from 'reselect';

import { getUserRole } from 'views/login/login.redux';
import { getConnectionStatus } from 'views/settings/settings.redux';

import {
  initialState,
  CURRENT_LOT_LIST_LOADING,
  SET_CURRENT_LOT_LIST,
  SET_FILTERED_LOT_LIST,
  CLEAR_CURRENT_LOT_LIST,
  SET_MULTISELECT_MODE,
  RESET_MULTISELECT_MODE,
  TOGGLE_SELECTION,
  CLEAR_SELECTION,
  RESET_ALL_FILTERS,
  SET_SELECTED_LOT_FILTERS,
  // SUBMIT_ISSUE_FAILURE,
  TOGGLE_SEARCHBAR,
  SET_SEARCH_QUERY,
  LOTLIST_REQUESTED,
  LOTLIST_LOADED,
  LOTLIST_FAILED,
  FILTER_WITH_QUERY,
  UPDATE_LOT_LIST_AFTER_CLEAR_ISSUE,
  UPDATE_LOT_LIST_AFTER_CHANGE_DRIVER,
  TRIP_ACTION_REQUESTED,
  TRIP_ACTION_RESPONDED,
  CACHE_LOT_INFO,
  REMOVE_LOT_INFO_FROM_CACHE,
  HANDLE_SORT_CHANGE,
  SORT_MODAL_VISIBLE,
  FILTER_MODAL_VISIBLE,
  LOTLIST_NEXTPAGE_LOADED,
  LOTLIST_NEXTPAGE_REQUESTED,
} from './lotlist.constants';

import { ReducerState, Action } from './types';
import { LotItemType } from './components/LotItem/types';

const upsertLotInfo = cache => (id: number, { notes = [], charges = {} }) =>
  mergeDeepRight(cache)({ [id]: { notes, charges } });

export const lotListReducer = (state: ReducerState = initialState, action: Action) => {
  switch (action.type) {
    case CURRENT_LOT_LIST_LOADING: {
      return {
        ...state,
        lotList: {
          ...state.lotList,
          lots: [],
          filteredLots: [],
          isLoading: true,
        },
      };
    }
    case TRIP_ACTION_REQUESTED: {
      return {
        ...state,
        lotList: {
          ...state.lotList,
          isLoading: true,
        },
      };
    }
    case TRIP_ACTION_RESPONDED: {
      return {
        ...state,
        lotList: {
          ...state.lotList,
          isLoading: false,
        },
      };
    }
    case SET_CURRENT_LOT_LIST: {
      return {
        ...state,
        lotList: {
          ...state.lotList,
          lots: action.lotList,
          filteredLots: action.lotList,
          isLoading: false,
          filters: {
            selectedFilters: {},
            totalCount: 0,
            isVisible: false,
          },
        },
      };
    }
    case SET_FILTERED_LOT_LIST: {
      return {
        ...state,
        lotList: {
          ...state.lotList,
          filteredLots: action.filteredLots,
        },
      };
    }
    case FILTER_MODAL_VISIBLE: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          filters: {
            ...state[action.bucket].filters,
            isVisible: !state[action.bucket].filters.isVisible,
          },
        },
      };
    }
    case SET_SELECTED_LOT_FILTERS: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          filters: {
            ...state[action.bucket].filters,
            selectedFilters: action.selectedFilters,
            totalCount: action.totalCount,
          },
        },
      };
    }
    case RESET_ALL_FILTERS: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          filters: initialState.lotList.filters,
          search: initialState.lotList.search,
          sort: initialState.lotList.sort,
          page: 1,
        },
      };
    }
    case CLEAR_CURRENT_LOT_LIST: {
      return {
        ...state,
        lotList: initialState.lotList,
      };
    }
    case SET_MULTISELECT_MODE: {
      return {
        ...state,
        multiselect: {
          active: action.active,
          type: action.multiselectType,
        },
      };
    }
    case RESET_MULTISELECT_MODE: {
      return {
        ...state,
        multiselect: initialState.multiselect,
        selectedLots: initialState.selectedLots,
      };
    }
    case TOGGLE_SELECTION: {
      return {
        ...state,
        selectedLots: assoc(action.lotNumber, !state.selectedLots[action.lotNumber])(
          state.selectedLots,
        ),
      };
    }
    case CLEAR_SELECTION: {
      return {
        ...state,
        selectedLots: initialState.selectedLots,
      };
    }
    case LOTLIST_REQUESTED: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          // lots: [],
          // filteredLots: [],
          isLoading: true,
        },
      };
    }
    case LOTLIST_NEXTPAGE_REQUESTED: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          isLoadingNextPage: true,
        },
      };
    }
    case LOTLIST_LOADED: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          lots: action.lots,
          filteredLots: action.lots,
          isLoading: false,
          count: action.count || 0,
          page: 1,
        },
      };
    }
    case LOTLIST_NEXTPAGE_LOADED: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          lots: action.lots,
          filteredLots: action.lots,
          isLoadingNextPage: false,
          count: action.count || 0,
          page: action.page,
        },
      };
    }
    case LOTLIST_FAILED: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          isLoading: false,
          isLoadingNextPage: false,
          error: action.error,
        },
      };
    }

    case UPDATE_LOT_LIST_AFTER_CLEAR_ISSUE:
    case UPDATE_LOT_LIST_AFTER_CHANGE_DRIVER: {
      return {
        ...state,
        [action.lotBucket]: {
          ...state[action.lotBucket],
          lots: action.lotList,
          filteredLots: action.lotList,
          isLoading: false,
        },
      };
    }

    case TOGGLE_SEARCHBAR: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          search: {
            ...state[action.bucket].search,
            visible: action.visible,
          },
        },
      };
    }
    case SET_SEARCH_QUERY: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          search: {
            ...state[action.bucket].search,
            query: action.query,
          },
        },
      };
    }
    case FILTER_WITH_QUERY: {
      return {
        ...state,
        search: {
          ...state.search,
          result: action.result,
        },
      };
    }
    case CACHE_LOT_INFO:
      return {
        ...state,
        cache: upsertLotInfo(state.cache)(action.id, action.data),
      };
    case REMOVE_LOT_INFO_FROM_CACHE:
      return {
        ...state,
        cache: dissoc(action.id)(state.cache),
      };
    case HANDLE_SORT_CHANGE: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          sort: {
            ...state[action.bucket].sort,
            selectedField: action.selectedField,
            isModalVisible: false,
          },
        },
      };
    }
    case SORT_MODAL_VISIBLE: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          sort: {
            ...state[action.bucket].sort,
            isModalVisible: !state[action.bucket].sort.isModalVisible,
          },
        },
      };
    }
    case 'persist/REHYDRATE': {
      return {
        ...initialState,
        cache: pathOr({}, ['payload', 'lotlist', 'cache'], action),
      };
    }
    default:
      return state;
  }
};

const getTrip = pathOr(null, ['lotlist', 'trip']);
const getIsLoading = pathOr(false, ['lotlist', 'isLoading']);
const getError = pathOr(null, ['lotlist', 'error']);
const getSelectedLots = pathOr({}, ['lotlist', 'selectedLots']);
const getMultiselect = pathOr({}, ['lotlist', 'multiselect']);
const getLotList = pathOr({}, ['lotlist', 'lotList']);

export const lotListSelector = createStructuredSelector({
  trip: getTrip,
  lotList: getLotList,
  isLoading: getIsLoading,
  error: getError,
  multiselect: getMultiselect,
  selectedLots: getSelectedLots,
  role: getUserRole,
  connectionStatus: getConnectionStatus,
});
