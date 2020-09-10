import { createStructuredSelector } from 'reselect';
import { combineReducers } from 'redux';
import { pathOr } from 'ramda';
import { driverReducer } from './drivercontainer/drivercontainer.redux';
import { groupsReducer } from './groupscontainer/groupscontainer.redux';

import {
  initialState,
  GET_VENDOR_INFO_INIT,
  GET_VENDOR_INFO_SUCCESS,
  GET_VENDOR_INFO_ERROR,
} from './usermanagement.constants';

const userManagementReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VENDOR_INFO_INIT:
      return {
        ...state,
        isLoading: true,
      };

    case GET_VENDOR_INFO_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    case GET_VENDOR_INFO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        vendor: action.data,
      };

    default:
      return state;
  }
};

const getUMIsLoading = pathOr(false, ['userManagement', 'userManagement', 'isLoading']);
const getUMError = pathOr(false, ['userManagement', 'userManagement', 'error']);
const getVendor = pathOr(null, ['userManagement', 'userManagement', 'vendor']);

export const userManagementSelector = createStructuredSelector({
  isLoading: getUMIsLoading,
  error: getUMError,
  vendor: getVendor,
});

export default combineReducers({
  userManagement: userManagementReducer,
  driver: driverReducer,
  group: groupsReducer,
});
