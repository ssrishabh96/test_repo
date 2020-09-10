export const TRIPS_REQUESTED = 'TRIPS_REQUESTED';
export const TRIPS_LOADED = 'TRIPS_LOADED';
export const TRIPS_FAILED = 'TRIPS_FAILED';

export const SET_MULTISELECT_MODE = 'SET_MULTISELECT_MODE';
export const RESET_MULTISELECT_MODE = 'RESET_MULTISELECT_MODE';
export const TOGGLE_SEARCHBAR = 'TOGGLE_SEARCHBAR';
export const DEACTIVATE_SEARCHBAR = 'DEACTIVATE_SEARCHBAR';
export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
// lot multi-select actions - NOT DONE HERE// TODO: Remove
export const SET_MULTISELECT_GROUP = 'SET_MULTISELECT_GROUP';
export const TOGGLE_SELECTION = 'TOGGLE_SELECTION';
export const CLEAR_SELECTION = 'CLEAR_SELECTION';

export const TRIP_ACTION_REQUESTED = 'TRIP_ACTION_REQUESTED';
export const TRIP_ACTION_RESPONDED = 'TRIP_ACTION_RESPONDED';

// distribute trips
export const DISTRIBUTE_TRIPS_REQUESTED = 'DISTRIBUTE_TRIPS_REQUESTED';
export const DISTRIBUTE_TRIPS_RESPONDED = 'DISTRIBUTE_TRIPS_RESPONDED';
export const DISTRIBUTE_TRIPS_FAILED = 'DISTRIBUTE_TRIPS_FAILED';

export const SEND_RESPONSE_RECIEVED = 'SEND_RESPONSE_RECIEVED';

export const UPDATE_TRIP_IN_ACCEPTED = 'UPDATE_TRIP_IN_ACCEPTED';
export const UPDATE_TRIP_IN_ASSIGNED = 'UPDATE_TRIP_IN_ASSIGNED';
export const UPDATE_TRIP_BY_TYPE = 'UPDATE_TRIP_BY_TYPE';

export const UPDATE_TRIP_WITH_ISSUE = 'UPDATE_TRIP_WITH_ISSUE';
export const UPDATE_TRIP_AFTER_CLEAR_ISSUE = 'UPDATE_TRIP_AFTER_CLEAR_ISSUE';

// filter view constants
export const SET_SELECTED_FILTERS = 'SET_SELECTED_FILTERS';
export const TRIP_FILTER_MODAL_VISIBLE = 'TRIP_FILTER_MODAL_VISIBLE';

// sort constants
export const HANDLE_SORT_CHANGE = 'HANDLE_SORT_CHANGE';
export const MODAL_VISIBLE = 'MODAL_VISIBLE';

export const RESET_ALL_TRIP_FILTERS = 'RESET_ALL_TRIP_FILTERS';

export const TRIPLIST_NEXTPAGE_LOADED = 'TRIPLIST_NEXTPAGE_LOADED';
export const TRIPS_NEXTPAGE_REQUESTED = 'TRIPS_NEXTPAGE_REQUESTED';

const tripList = {
  trips: [],
  isLoading: false,
  isLoadingNextPage: false,
  filters: {
    selectedFilters: {},
    totalCount: 0,
    isVisible: false,
  },
  search: {
    query: '',
    visible: false,
  },
  sort: {
    isModalVisible: false,
    selectedField: {},
  },
  page: 1,
  count: 0,
};

export const initialState = {
  loading: false,
  assigned: tripList,
  accepted: tripList,
  distributed: tripList,
  multiselect: {
    active: false,
    group: null,
    type: '', // distribute / response
  },
  selected: {}, // (new Map(): Map<number, boolean>),
};
