import {
  GET_DRIVERS_LIST_INIT,
  GET_DRIVERS_LIST_FULFILLED,
  GET_DRIVERS_LIST_ERROR,
  //
  ADD_DRIVER_REQUEST,
  ADD_DRIVER_ERROR,
  ADD_DRIVER_SUCCESS,
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

import * as usermanagementService from '../usermanagement.service';
import { getActiveVendor } from 'views/login/login.redux';

import { getActiveVendorId } from 'views/login/helpers/loginHelpers';
import { singlePersonnelMapper } from 'utils/mappers/userManagementMapper';

export const getDriversInit = () => ({
  type: GET_DRIVERS_LIST_INIT,
});

export const getDriversError = error => ({
  type: GET_DRIVERS_LIST_ERROR,
  error,
});

export const getDriversSuccess = data => ({
  type: GET_DRIVERS_LIST_FULFILLED,
  data,
  // dataByGroupName,
});

export const updateDriverInit = () => ({
  type: UPDATE_DRIVER_INIT,
});

export const updateDriverSuccess = () => ({
  type: UPDATE_DRIVER_SUCCESS,
});

export const updateDriverError = error => ({
  type: UPDATE_DRIVER_ERROR,
  error,
});

// const prepareDriversListByGroup = (data) => {
//   // Fallback name for the group: 'NOGROUP'
//   const byDriverGroupName = groupBy(propOr('NOGROUP', 'group'));
//   const convert = compose(map(zipObj(['groupTitle', 'data'])), toPairs);
//   const dataByGroupName = convert(byDriverGroupName(data));
//   return dataByGroupName;
// };

export const getDrivers = () => (dispatch, getState) => {
  dispatch(getDriversInit());
  const vendorId = getActiveVendor(getState());
  usermanagementService
    .getPersonnel(vendorId)
    .then(({ data }) => {
      if (data) {
        dispatch(getDriversSuccess(data));
      } else {
        dispatch(getDriversError({ error: { message: 'Error loading drivers list' } }));
      }
    })
    .catch(error => dispatch(getDriversError({ error })));
};

export const addNewDriverInit = () => ({
  type: ADD_DRIVER_REQUEST,
});

export const addNewDriverError = error => ({
  type: ADD_DRIVER_ERROR,
  error,
});

export const addNewDriverSuccess = () => ({
  type: ADD_DRIVER_SUCCESS,
});

export const addDriver = (data, navigator) => (dispatch, getState) => {
  const vendorId = getActiveVendor(getState());
  const newDriver = {
    firstName: data.driverFName,
    middleName: data.driverMName || null,
    lastName: data.driverLName,
    phoneNum: data.driverContactNumber,
    email: data.driverEmail,
    roleId: '3',
    startDate: data.driverStartDate,
    vendorId,
    dateOfBirth: null,
    pcardFlg: 'N',
    createUser: 'some-user@copart.com',
    lastUpdateUser: 'some-user@copart.com',
    sourceSystem: 'mobile',
  };
  console.log('PayLoad-->', newDriver, vendorId);
  dispatch(addNewDriverInit());
  return usermanagementService
    .addDriver(newDriver, vendorId)
    .then((response) => {
      if (response && response.status && response.status === 'success') {
        dispatch(addNewDriverSuccess());
        dispatch(getDrivers());

        navigator.dismissModal();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: 'New driver added successfully!',
          },
          autoDismissTimerSec: 3,
        });
      } else {
        dispatch(addNewDriverError({ error: { message: 'Error adding new driver' } }));
        navigator.dismissModal();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: 'Error adding new driver',
          },
          autoDismissTimerSec: 1.5,
        });
      }
    })
    .catch((err) => {
      console.log('error in action: ', err);
      dispatch(addNewDriverError({ error: err }));
      navigator.dismissModal();
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: 'ERROR in service call!',
        },
        autoDismissTimerSec: 1.5,
      });
    });
};

export const updateDriver = (driverObj, navigator) => (dispatch, getState) => {
  const vendorId = getActiveVendor(getState());
  dispatch(updateDriverInit());

  return usermanagementService
    .updateDriver(driverObj, vendorId, driverObj.vendorPersonnelId)
    .then((response) => {
      if (response && response.status && response.status === 'success') {
        dispatch(updateDriverSuccess());
        dispatch(getDrivers());
        navigator.dismissModal();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: 'Driver udpated successfully!',
          },
          autoDismissTimerSec: 3,
        });
      } else {
        dispatch(updateDriverError({ error: { message: 'Error updating driver!' } }));
        navigator.dismissModal();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: 'Error updating driver!',
          },
          autoDismissTimerSec: 1.5,
        });
      }
    })
    .catch((err) => {
      console.log('err: ', err);
      dispatch(updateDriverError({ error: err }));
      navigator.dismissModal();
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: 'Error driver update service!',
        },
        autoDismissTimerSec: 1.5,
      });
    });
};

export const setCurrentDriver = driverObj => (dispatch) => {
  dispatch({
    type: SET_CURRENT_DRIVER_INIT,
  });
  setTimeout(() => {
    dispatch({
      type: SET_CURRENT_DRIVER_SUCCESS,
      driver: driverObj,
    });
  }, 250);
};

export const updatePersonnelData = (vendorPersonnelId, data, navigator) => (dispatch, getState) => {
  const vendorId = getActiveVendorId(getState());
  dispatch({ type: UPDATE_DRIVER_INIT });
  return usermanagementService
    .updatePersonnelData(vendorId, vendorPersonnelId, data)
    .then(({ status, data: driverData }: Object) => {
      if (status === 'success') {
        const driver = singlePersonnelMapper(driverData);
        dispatch({
          type: UPDATE_DRIVER_SUCCESS,
          driver,
        });
        dispatch(getDrivers()); // update list view
        dispatch(setCurrentDriver(driver));
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: `${driver.firstName} ${driver.lastName} updated successfully!`,
          },
          autoDismissTimerSec: 1.0,
        });
      } else {
        dispatch({
          type: UPDATE_DRIVER_ERROR,
          error: 'Error updating driver!',
        });
      }
    })
    .catch(error =>
      dispatch({
        type: UPDATE_DRIVER_ERROR,
        error: `Service error: \n ${JSON.stringify(error)}`,
      }),
    );
};

export const requestPcard = (personnelId, yardNumber, navigator) => (dispatch) => {
  dispatch({ type: PCARD_ACTION_INIT });
  return usermanagementService
    .requestPcard(personnelId, yardNumber)
    .then((response: Object) => {
      const { status, data } = response;
      if (status === 'success' && 'vendor_personnel_id' in data) {
        const driver = singlePersonnelMapper(data);
        dispatch({
          type: PCARD_ACTION_SUCCESS,
          driver,
        });
        dispatch(getDrivers()); // update list view
        dispatch(setCurrentDriver(driver));
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: `Pcard requested successfully for ${driver.firstName} ${driver.lastName}!`,
          },
          autoDismissTimerSec: 3.0,
        });
      } else {
        dispatch({
          type: PCARD_ACTION_ERROR,
          error: 'Error requesting pcard!',
        });

        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: response.data.parsedErrorMessage,
          },
          autoDismissTimerSec: 3.0,
        });
      }
    })
    .catch((error) => {
      console.log('requestpcard::error::catch: ', error);
      dispatch({
        type: PCARD_ACTION_ERROR,
        error: `Service error: \n ${JSON.stringify(error)}`,
      });
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: `Error::CATCH: ${JSON.stringify(error)}`,
        },
        autoDismissTimerSec: 3.0,
      });
    });
};

export const togglePcardStatus = (personnelId, status, last4, navigator) => (dispatch) => {
  dispatch({ type: PCARD_ACTION_INIT });
  return usermanagementService
    .activateInactivePcard(personnelId, status, last4)
    .then(({ status: apiResponseStatus, data }: Object) => {
      if (apiResponseStatus === 'success' && 'vendor_personnel_id' in data) {
        const driver = singlePersonnelMapper(data);
        dispatch({
          type: PCARD_ACTION_SUCCESS,
          driver,
        });
        dispatch(getDrivers()); // update list view
        dispatch(setCurrentDriver(driver));
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: `Pcard is now ${status === 'I' ? 'Inactive' : 'Active'} !`,
          },
          autoDismissTimerSec: 3.0,
        });
      } else {
        dispatch({
          type: PCARD_ACTION_ERROR,
          error: 'Error requesting pcard!',
        });
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: `Error: ${JSON.stringify(data)}`,
          },
          autoDismissTimerSec: 3.0,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: PCARD_ACTION_ERROR,
        error: `Service error: \n ${JSON.stringify(error)}`,
      });
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: `Error in service call: ${JSON.stringify(error)}`,
        },
        autoDismissTimerSec: 3.0,
      });
    });
};

export const destroyPcard = (personnelId, navigator) => (dispatch) => {
  dispatch({ type: PCARD_ACTION_INIT });
  return usermanagementService
    .destroyPcard(personnelId)
    .then(({ status, data }: Object) => {
      if (status === 'success' && 'vendor_personnel_id' in data) {
        const driver = singlePersonnelMapper(data);
        dispatch({
          type: PCARD_ACTION_SUCCESS,
          driver,
        });
        dispatch(getDrivers()); // update list view
        dispatch(setCurrentDriver(driver));
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: 'Pcard destroyed!',
          },
          autoDismissTimerSec: 3.0,
        });
      } else {
        dispatch({
          type: PCARD_ACTION_ERROR,
          error: 'Error requesting pcard!',
        });
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: `Error: ${JSON.stringify(data)}`,
          },
          autoDismissTimerSec: 3.0,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: PCARD_ACTION_ERROR,
        error: `Service error: \n ${JSON.stringify(error)}`,
      });
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: `Error in service call: ${JSON.stringify(error)}`,
        },
        autoDismissTimerSec: 3.0,
      });
    });
};
