import { pathOr, sortBy, prop, compose } from 'ramda';
import { createStructuredSelector } from 'reselect';
import {
  initialState,
  REQUEST_DRIVERS_LIST_INIT,
  REQUEST_GROUPS_LIST_INIT,
  REQUEST_DRIVERS_LIST_SUCCESS,
  REQUEST_GROUPS_LIST_SUCCESS,
  FETCH_GROUPS_AND_DRIVERS_SUCCESS,
  DISTRIBUTE_ASSIGNMENTS_REQUESTED,
  DISTRIBUTE_ASSIGNMENTS_RESPONDED,
} from './assigntolist.constants';

export const assignToListReducer = (state = initialState, action) => {
  switch (action.type) {
    case DISTRIBUTE_ASSIGNMENTS_REQUESTED:
    case REQUEST_DRIVERS_LIST_INIT:
    case REQUEST_GROUPS_LIST_INIT:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case DISTRIBUTE_ASSIGNMENTS_RESPONDED:
      return {
        ...state,
        isLoading: false,
      };
    case REQUEST_DRIVERS_LIST_SUCCESS:
      return {
        ...state,
        driversList: action.data,
        // isLoading: false,
      };
    case REQUEST_GROUPS_LIST_SUCCESS:
      return {
        ...state,
        groupsList: action.data,
        // isLoading: false,
      };
    case FETCH_GROUPS_AND_DRIVERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

const sortByStatus = sortBy(prop('status'));
// const sortByDispatchableFlag = sortBy(prop('dispatchableFlag'));

const getIsLoading = pathOr(false, ['assigntolist', 'isLoading']);
const getDrivers = pathOr(false, ['assigntolist', 'driversList']);
const getGroups = pathOr([], ['assigntolist', 'groupsList']);

const getSortedDrivers = compose(sortByStatus, getDrivers);
const getSortedGroups = compose(sortByStatus, getGroups);

export const assignToListSelector = createStructuredSelector({
  isLoading: getIsLoading,
  driversList: getSortedDrivers,
  groupsList: getSortedGroups,
});
