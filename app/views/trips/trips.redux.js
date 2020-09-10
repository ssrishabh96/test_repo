import { assoc, map, when, slice } from 'ramda';
import {
  initialState,
  TRIPS_REQUESTED,
  TRIPS_LOADED,
  TRIPS_FAILED,
  DISTRIBUTED_TRIPS_LOADED,
  SET_MULTISELECT_MODE,
  RESET_MULTISELECT_MODE,
  SET_MULTISELECT_GROUP,
  TOGGLE_SELECTION,
  CLEAR_SELECTION,
  SET_SELECTED_FILTERS,
  TRIP_FILTER_MODAL_VISIBLE,
  TRIP_ACTION_REQUESTED,
  TRIP_ACTION_RESPONDED,
  SEND_RESPONSE_RECIEVED,
  UPDATE_TRIP_IN_ACCEPTED,
  UPDATE_TRIP_IN_ASSIGNED,
  UPDATE_TRIP_BY_TYPE,
  UPDATE_TRIP_WITH_ISSUE,
  RESET_ALL_TRIP_FILTERS,
  UPDATE_TRIP_AFTER_CLEAR_ISSUE,
  TOGGLE_SEARCHBAR,
  SET_SEARCH_QUERY,
  DEACTIVATE_SEARCHBAR,
  HANDLE_SORT_CHANGE,
  MODAL_VISIBLE,
  TRIPLIST_NEXTPAGE_LOADED,
  TRIPS_NEXTPAGE_REQUESTED,
} from './trips.constants';

import { removeLotForTrip, matchesTripId } from './helpers/tripHelpers';

const updateLotListForTrip = (updatedList, tripId) =>
  map(when(matchesTripId(tripId), assoc('lots', updatedList)));

export const tripsReducer = (state = initialState, action) => {
  switch (action.type) {
    case TRIPS_REQUESTED: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          isLoading: true,
        },
      };
    }
    case TRIPS_NEXTPAGE_REQUESTED: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          isLoadingNextPage: true,
        },
      };
    }
    case TRIPS_LOADED: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          isLoading: false,
          trips: action.trips,
          page: 1,
          count: action.count,
        },
      };
    }
    case TRIPLIST_NEXTPAGE_LOADED: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          isLoadingNextPage: false,
          trips: action.trips,
          page: action.page,
          count: action.count,
        },
      };
    }
    case TRIPS_FAILED: {
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
        selected: initialState.selected,
      };
    }
    case SET_MULTISELECT_GROUP: {
      return {
        ...state,
        multiselect: {
          ...state.multiselect,
          group: action.group,
        },
      };
    }
    case TOGGLE_SELECTION: {
      return {
        ...state,
        selected: assoc(action.id, !state.selected[action.id])(state.selected),
      };
    }
    case CLEAR_SELECTION: {
      return {
        ...state,
        multiselect: {
          ...state.multiselect,
          group: null,
        },
        selected: initialState.selected,
      };
    }
    case SET_SELECTED_FILTERS: {
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
    case TRIP_FILTER_MODAL_VISIBLE: {
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
    case RESET_ALL_TRIP_FILTERS: {
      return {
        ...state,
        [action.bucket]: {
          ...state[action.bucket],
          filters: initialState[action.bucket].filters,
          search: initialState[action.bucket].search,
          sort: initialState[action.bucket].sort,
        },
      };
    }
    case TRIP_ACTION_REQUESTED: {
      return {
        ...state,
        loading: true,
      };
    }
    case TRIP_ACTION_RESPONDED: {
      return {
        ...state,
        loading: false,
      };
    }
    case SEND_RESPONSE_RECIEVED: {
      return {
        ...state,
        accepted: {
          ...state.accepted,
          trips: [...state.accepted, ...action.newAcceptedTrips],
        },
      };
    }
    case UPDATE_TRIP_IN_ACCEPTED: {
      return {
        ...state,
        accepted: {
          ...state.accepted,
          trips: removeLotForTrip(action.lot)(state.accepted),
        },
      };
    }
    case UPDATE_TRIP_IN_ASSIGNED: {
      return {
        ...state,
        assigned: {
          ...state.assigned,
          trips: updateLotListForTrip(action.updatedList, action.tripId)(state.assigned),
        },
      };
    }
    case UPDATE_TRIP_BY_TYPE: {
      return {
        ...state,
        [action.tripType]: {
          ...[action.tripType],
          trips: action.updatedTrips,
        },
      };
    }
    case UPDATE_TRIP_WITH_ISSUE: {
      return {
        ...state,
        [action.lotBucket]: action.updatedTrip,
      };
    }
    case UPDATE_TRIP_AFTER_CLEAR_ISSUE: {
      return {
        ...state,
        [action.lotBucket]: action.updatedTrip,
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
    case MODAL_VISIBLE: {
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
    default:
      return state;
  }
};
