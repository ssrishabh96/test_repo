// @flow

import type { AxiosXHR, AxiosError } from 'axios';
import type { Dispatch as ReduxDispatch } from 'redux';
import type { GetState } from 'types/Redux';
import type { RNNNavigator } from 'types/RNNavigation';

// type GetState = () => State;
// type PromiseAction = Promise<Action>;
// type ThunkAction = (dispatch: Dispatch, getState: getState: GetState) => any;
// type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

import { SubmissionError } from 'redux-form';
import {
  LOGIN_REQUESTED,
  LOGIN_RESPONDED,
  LOGIN_ERROR,
  USER_LOGGED_IN,
  LOGOUT,
  UPDATE_SESSION,
  USER_INFO_REQUESTED,
  USER_INFO_RESPONDED,
  UPDATE_ACTIVE_PROFILE,
  ACCEPT_TERMS_REQUESTED,
  ACCEPT_TERMS_RESPONDED,
} from './login.constants';

import { unregisterForNotifications } from '../home/home.action';
import * as loginServices from './login.service';
import {
  buildSession,
  checkIfSingleVendorPresent,
  getActiveVendorId,
  getVendorByVendorId,
} from './helpers/loginHelpers';
import composeErrorMessage, { errorMessageMap } from 'utils/mappers/errorMessageMapper';

import { defaultNavStyles } from 'styles';
import Locale from 'utils/locale';

// replaces authenticate user and get user Info
export const login = (username: string, password: string, navigator: RNNNavigator) => (
  dispatch: ReduxDispatch,
) => {
  dispatch({ type: LOGIN_REQUESTED, username });
  return loginServices
    .authenticateUser(username, password)
    .then((response: AxiosXHR) => {
      dispatch({ type: LOGIN_RESPONDED });
      const session = buildSession(response.data);
      dispatch({ type: UPDATE_SESSION, session, email: username });
      return response;
    })
    .then((response: AxiosXHR) => {
      if (response.data.temp_password_flag) {
        navigator.showModal({
          label: 'ChangePassword',
          screen: 'CopartTransporter.ChangePassword',
          title: Locale.translate('settings.ChangePassword.Title'),
          navigatorStyles: defaultNavStyles,
          overrideBackPress: true,
        });
        return Promise.reject({});
      }
      return Promise.resolve(response);
    })
    .then(() => dispatch(getUserInfo(true, true, navigator)))
    .then(() => {
      dispatch({ type: USER_LOGGED_IN });
    })
    .catch((error: Object) => {
      dispatch({ type: LOGIN_ERROR, user: null, error });
      dispatch({
        type: USER_INFO_RESPONDED,
        profileInfo: { a: 'A' },
        error,
        loggedIn: false,
      });
      if (!error.response && error.message) {
        return Promise.reject({
          success: false,
          error: {
            response: {
              data: {
                errors: [{ [error.message]: error.message }],
              },
            },
          },
        });
      }
      return Promise.reject({ success: false, error });
    });
};

export const signoutUser = () => (dispatch: ReduxDispatch) => {
  dispatch(unregisterForNotifications());
  setTimeout(() => {
    dispatch({ type: LOGOUT });
  }, 500);
};

const getUserInfo = (
  showSelectionDialog: boolean,
  autoSelectProfile: boolean,
  navigator: RNNNavigator,
) => (dispatch: ReduxDispatch, getState: GetState) => {
  dispatch({ type: USER_INFO_REQUESTED, showSelectionDialog });
  return loginServices
    .getUserInfo()
    .then((response: AxiosXHR) => {
      if (response.status !== 200) return Promise.reject({ message: ['Request Failed'] });
      const userInfo = response.data;
      dispatch({
        type: USER_INFO_RESPONDED,
        profileInfo: userInfo,
        loggedIn: false,
      });
      if (autoSelectProfile) {
        const result = checkIfSingleVendorPresent(userInfo);
        if (result.result) {
          dispatch(setActiveProfile(result.vendor));
          return { response, userInfo };
        } else if (showSelectionDialog) {
          // open pick vendor dialog
          return new Promise((resolve, reject) => {
            navigator.showModal({
              title: Locale.translate('setting.activeProfile'),
              screen: 'CopartTransporter.Settings.ProfileSelection',
              navigatorStyle: defaultNavStyles,
              navigatorButtons: { leftButtons: [] },
              backButtonHidden: true,
              overrideBackPress: true,
              animationType: 'slide-up',
              passProps: {
                resolve: () => resolve({ response, userInfo }),
                reject: () => reject({ message: ['You must select a profile'] }),
                close: (navi: RNNNavigator) => {
                  navi.dismissModal();
                },
              },
            });
          });
        }
        // else pick the previously selected vendor somehow
        const currActiveVendorId = getActiveVendorId(getState());
        const vendor = getVendorByVendorId(userInfo, currActiveVendorId);
        if (vendor) dispatch(setActiveProfile(vendor));
      }
      return { response, userInfo };
    })
    .then(({ response, userInfo }) => {
      if (navigator && !userInfo.terms_and_conditions.accepted) {
        return new Promise((resolve, reject) => {
          navigator.showModal({
            screen: 'CopartTransporter.TermsAndConditions',
            overrideBackPress: true,
            passProps: {
              buttonType: 'AcceptDecline',
              resolve: () => {
                resolve(response);
              },
              reject: () => {
                reject({});
              },
            },
          });
        });
      }
    });
};
export const getUserInfoAction = (
  showSelectionDialog: boolean = false,
  autoSelectProfile: boolean = false,
  navigator: RNNNavigator,
) => (dispatch: ReduxDispatch) => {
  dispatch(getUserInfo(showSelectionDialog, autoSelectProfile, navigator)).catch(
    (error: AxiosError) => {
      dispatch({
        type: USER_INFO_RESPONDED,
        profileInfo: { a: 'A' },
        error,
        loggedIn: false,
        terms: true,
      });
    },
  );
};

export const setActiveProfile = vendor => ({
  type: UPDATE_ACTIVE_PROFILE,
  vendor,
});

export const submitForgotPassword = ({ email }: Object, navigator: RNNNavigator) => (
  dispatch: ReduxDispatch,
) =>
  loginServices
    .forgotPassword(email)
    .then((response: AxiosXHR) => {
      setTimeout(() => {
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: 'Success! An email with your temporary password will arive shortly.',
          },
        });
      }, 700);
      navigator.dismissModal();
      Promise.resolve(response);
      // return Promise.resolve(res);
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        const message = composeErrorMessage({ error });
        throw new SubmissionError({ _error: message });
      }
      if (errorMessageMap[error.message]) {
        // network error
        throw new SubmissionError({ _error: errorMessageMap[error.message] });
      }
      // unknown error
      console.log(error);
      throw new SubmissionError({ _error: 'Something went wrong, please try again' });
    });

export const submitChangePassword = (data: Object) => () =>
  loginServices.updatePassword(data.oldPassword, data.newPassword).catch((error: AxiosError) => {
    if (error.response) {
      const message = composeErrorMessage({ error });
      throw new SubmissionError({ _error: message });
    }
    if (errorMessageMap[error.message]) {
      throw new SubmissionError({ _error: errorMessageMap[error.message] });
    }
    throw new SubmissionError({ _error: 'Something went wrong, please try again' });
  });
export const acceptTerms = () => (dispatch: ReduxDispatch) => {
  dispatch({ type: ACCEPT_TERMS_REQUESTED });
  return loginServices.acceptTermsAndConditions().then((response: AxiosXHR) => {
    dispatch({ type: ACCEPT_TERMS_RESPONDED, accepted: response.data.status === 'success' });
  });
};
