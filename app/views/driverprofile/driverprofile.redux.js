import { pathOr } from 'ramda';
import { createStructuredSelector } from 'reselect';
import { getPersonnelData, getDefaultGroupName } from 'views/login/login.redux';
import { personnelDataMapper } from 'utils/mappers/userManagementMapper';

import {
  initialState,
  UPDATE_DRIVER_PROFILE_INIT,
  UPDATE_DRIVER_PROFILE_SUCCESS,
  UPDATE_DRIVER_PROFILE_ERROR,
} from './driverprofile.constants';

export const driverProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DRIVER_PROFILE_INIT:
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    case UPDATE_DRIVER_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case UPDATE_DRIVER_PROFILE_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

const getIsLoading = pathOr(false, ['driverProfile', 'isLoading']);
const getError = pathOr(false, ['driverProfile', 'error']);

export const driverProfileSelector = createStructuredSelector({
  driver: personnelDataMapper(getPersonnelData),
  groupName: getDefaultGroupName,
  isLoading: getIsLoading,
  error: getError,
});
