import {
  GET_VENDOR_INFO_INIT,
  GET_VENDOR_INFO_SUCCESS,
  GET_VENDOR_INFO_ERROR,
} from './usermanagement.constants';

import * as usermanagementService from './usermanagement.service';

import { getActiveVendor } from 'views/login/login.redux';

export const getVendorInfo = () => (dispatch, getState) => {
  dispatch({ type: GET_VENDOR_INFO_INIT });
  const vendorId = getActiveVendor(getState());
  return usermanagementService
    .getVendorInfo(vendorId)
    .then(({ status, data }) => {
      if (status === 200) {
        dispatch({
          type: GET_VENDOR_INFO_SUCCESS,
          data,
        });
      } else {
        dispatch({
          type: GET_VENDOR_INFO_ERROR,
          error: 'some error in ws call',
        });
      }
    })
    .catch(error => dispatch({ type: GET_VENDOR_INFO_ERROR, error }));
};
