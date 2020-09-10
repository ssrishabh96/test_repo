import { UPDATE_HOME_COUNTS, UPDATE_HOME_COUNTS_ERROR } from './home.constants';

import * as homeService from './home.service';

export const getHomeScreenCounts = navigator => (dispatch) => {
  homeService
    .getHomeScreenCounts()
    .then((counts) => {
      dispatch({ type: UPDATE_HOME_COUNTS, counts });
    })
    .catch((error) => {
      navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: error.response.data.parsedErrorMessage || JSON.stringify(error.response),
        },
        autoDismissTimerSec: 4.0,
      });
      dispatch({ type: UPDATE_HOME_COUNTS_ERROR, error });
    });
};

export const registerForNotifications = (token, email) => dispatch =>
  homeService
    .registerForNotifications(token, email)
    .then((response) => {})
    .catch((error) => {
      console.log('Unable to register', error);
    });
export const unregisterForNotifications = () => dispatch =>
  homeService.unregisterForNotifications().catch((error) => {
    console.log('Unable to de-register', error);
    throw error;
  });
