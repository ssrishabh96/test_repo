import { createStructuredSelector } from 'reselect';
import { pathOr, sortBy, prop, compose, head } from 'ramda';
import {
  initialState,
  GET_DRIVERS_LIST_INIT,
  GET_DRIVERS_LIST_FULFILLED,
  GET_DRIVERS_LIST_ERROR,
  //
  ADD_DRIVER_REQUEST,
  ADD_DRIVER_SUCCESS,
  ADD_DRIVER_ERROR,
  //
  UPDATE_DRIVER_INIT,
  UPDATE_DRIVER_SUCCESS,
  UPDATE_DRIVER_ERROR,
  //
  SET_CURRENT_DRIVER_INIT,
  SET_CURRENT_DRIVER_SUCCESS,
  //
  PCARD_ACTION_INIT,
  PCARD_ACTION_SUCCESS,
  PCARD_ACTION_ERROR,
} from './drivercontainer.constants';

import { getGroupsList } from '../groupscontainer/groupscontainer.redux';

const getDriverListData = pathOr([], ['userManagement', 'driver', 'data']);
const getDriverIsLoading = pathOr(false, ['userManagement', 'driver', 'isLoading']);
const getDriverError = pathOr(null, ['userManagement', 'driver', 'error']);
const getCurrentDriver = pathOr(null, ['userManagement', 'driver', 'currentDriver']);

const getYardsList = compose(
  // map(prop('facility_id')),
  prop('yards'),
  head,
  getGroupsList,
);

export const driverSelector = createStructuredSelector({
  // driversList: getDriverListByGroupType,
  driverData: getDriverListData,
  driverIsLoading: getDriverIsLoading,
  driverError: getDriverError,
  currentDriver: getCurrentDriver,
  yards: getYardsList,
});

const sortByName = sortBy(prop('firstName'));

export const driverReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DRIVERS_LIST_INIT:
    case ADD_DRIVER_REQUEST:
    case UPDATE_DRIVER_INIT:
    case SET_CURRENT_DRIVER_INIT:
    case PCARD_ACTION_INIT:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case ADD_DRIVER_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case GET_DRIVERS_LIST_ERROR:
    case ADD_DRIVER_ERROR:
    case UPDATE_DRIVER_ERROR:
    case PCARD_ACTION_ERROR:
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };

    case SET_CURRENT_DRIVER_SUCCESS:
    case UPDATE_DRIVER_SUCCESS:
    case PCARD_ACTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentDriver: action.driver,
        error: null,
      };

    case GET_DRIVERS_LIST_FULFILLED:
      return {
        ...state,
        data: sortByName(action.data),
        isLoading: false,
        error: null,
      };

    default:
      return state;
  }
};
