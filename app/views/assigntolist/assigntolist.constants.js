export const initialState = {
  driversList: [],
  groupsList: [],
  isLoading: false,
  error: null,
};

// fetch drivers list actions
export const REQUEST_DRIVERS_LIST_INIT = 'REQUEST_DRIVERS_LIST_INIT';
export const REQUEST_DRIVERS_LIST_SUCCESS = 'REQUEST_DRIVERS_LIST_SUCCESS';
export const REQUEST_DRIVERS_LIST_FAILURE = 'REQUEST_DRIVERS_LIST_FAILURE';

// fetch groups list actions
export const REQUEST_GROUPS_LIST_INIT = 'REQUEST_GROUPS_LIST_INIT';
export const REQUEST_GROUPS_LIST_SUCCESS = 'REQUEST_GROUPS_LIST_SUCCESS';
export const REQUEST_GROUPS_LIST_FAILURE = 'REQUEST_GROUPS_LIST_FAILURE';

export const FETCH_GROUPS_AND_DRIVERS_SUCCESS = 'FETCH_GROUPS_AND_DRIVERS_SUCCESS';

export const DISTRIBUTE_ASSIGNMENTS_REQUESTED = 'DISTRIBUTE_ASSIGNMENTS_REQUESTED';
export const DISTRIBUTE_ASSIGNMENTS_RESPONDED = 'DISTRIBUTE_ASSIGNMENTS_RESPONDED';