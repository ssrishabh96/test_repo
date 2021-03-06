export const initialState = {
  data: [],
  error: null,
  isLoading: false,
  currentDriver: null,
};

export const GET_DRIVERS_LIST_INIT = 'GET_DRIVERS_LIST_INIT';
export const GET_DRIVERS_LIST_FULFILLED = 'GET_DRIVERS_LIST_FULFILLED';
export const GET_DRIVERS_LIST_ERROR = 'GET_DRIVERS_LIST_ERROR';

export const ADD_DRIVER_REQUEST = 'ADD_DRIVER_REQUEST';
export const ADD_DRIVER_SUCCESS = 'ADD_DRIVER_SUCCESS';
export const ADD_DRIVER_ERROR = 'ADD_DRIVER_ERROR';

export const UPDATE_DRIVER_INIT = 'UPDATE_DRIVER_INIT';
export const UPDATE_DRIVER_SUCCESS = 'UPDATE_DRIVER_SUCCESS';
export const UPDATE_DRIVER_ERROR = 'UPDATE_DRIVER_ERROR';

export const SET_CURRENT_DRIVER_INIT = 'SET_CURRENT_DRIVER';
export const SET_CURRENT_DRIVER_SUCCESS = 'SET_CURRENT_DRIVER_SUCCESS';
export const UPDATE_CURRENT_DRIVER = 'UPDATE_CURRENT_DRIVER';

export const PCARD_ACTION_INIT = 'PCARD_ACTION_INIT';
export const PCARD_ACTION_SUCCESS = 'PCARD_ACTION_SUCCESS';
export const PCARD_ACTION_ERROR = 'PCARD_ACTION_ERROR';
