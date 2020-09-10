// @flow

import { keys } from 'ramda';

import {
  UPDATE_DRIVER_PROFILE_INIT,
  UPDATE_DRIVER_PROFILE_SUCCESS,
  UPDATE_DRIVER_PROFILE_ERROR,
} from './driverprofile.constants';
import * as driverProfileService from './driverprofile.service';
import { getUserInfoAction } from 'views/login/login.action';

export const updateDriverProfile = (
  vendorId: number,
  personnelId: number,
  data: Object,
  navigator: Object,
) => (dispatch: Function) => {
  dispatch({ type: UPDATE_DRIVER_PROFILE_INIT });
  return driverProfileService
    .updateDriverProfile(vendorId, personnelId, data)
    .then((response: Object) => {
      if (
        keys(response).length > 0 &&
        'vendor_personnel_id' in response &&
        response.vendor_personnel_id === personnelId
      ) {
        dispatch({ type: UPDATE_DRIVER_PROFILE_SUCCESS });
        dispatch(getUserInfoAction(false, true, navigator));
        navigator.dismissModal();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: 'Profile Updated Successfully!',
          },
          autoDismissTimerSec: 2.0,
        });
      } else {
        dispatch({ type: UPDATE_DRIVER_PROFILE_ERROR });
        navigator.dismissModal();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: response.data.parsedErrorMessage,
          },
          autoDismissTimerSec: 10.0,
        });
      }
    })
    .catch((error: Object) => {
      console.log('Error in service::updateDriverProfile ', error);
      dispatch({ type: UPDATE_DRIVER_PROFILE_ERROR });
    });
};
