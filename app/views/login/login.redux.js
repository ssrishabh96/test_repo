// @flow

import { createStructuredSelector } from 'reselect';
import { pathOr, head, compose, propOr, omit } from 'ramda';
import { State, Action } from './types';
import {
  initialState,
  LOGIN_REQUESTED,
  LOGIN_RESPONDED,
  LOGIN_ERROR,
  USER_LOGGED_IN,
  LOGOUT,
  UPDATE_SESSION,
  USER_INFO_REQUESTED,
  USER_INFO_RESPONDED,
  UPDATE_ACTIVE_PROFILE,
  FORGOTPASSWORD_REQUESTED,
  CHANGEPASSWORD_REQUESTED,
  ACCEPT_TERMS_REQUESTED,
  ACCEPT_TERMS_RESPONDED,
} from './login.constants';

import {
  getVersionNumber,
  getBuildNumber,
  getConnectionStatus,
} from 'views/settings/settings.redux';

export const loginReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case LOGIN_REQUESTED:
      return {
        ...state,
        form: {
          username: action.username,
        },
        isLoading: true,
        email: action.username,
      };
    case LOGIN_RESPONDED:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loggedIn: false,
        isLoading: false,
      };
    case USER_LOGGED_IN:
      return {
        ...state,
        loggedIn: true,
        isLoading: false,
      };
    case LOGOUT:
      return {
        ...state,
        user: initialState.user,
        session: initialState.session,
        loggedIn: false,
      };
    case UPDATE_SESSION:
      return {
        ...state,
        session: action.session,
        email: action.email,
      };
    case USER_INFO_REQUESTED:
      return {
        ...state,
        user: {
          ...state.user,
          profiles: {
            ...state.user.profiles,
            showSelectionDialog: action.showSelectionDialog,
            isLoading: true,
          },
        },
      };
    case USER_INFO_RESPONDED:
      return {
        ...state,
        user: {
          ...state.user,
          profiles: {
            ...state.user.profiles,
            profileInfo: action.profileInfo,
            isLoading: false,
          },
        },
      };
    case UPDATE_ACTIVE_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          profiles: {
            ...state.user.profiles,
            activeProfile: { vendor: action.vendor },
            showSelectionDialog: false,
            isLoading: false,
          },
        },
      };
    case FORGOTPASSWORD_REQUESTED:
      return {
        ...state,
        email: action.email,
      };
    case CHANGEPASSWORD_REQUESTED:
      return {
        ...state,
        firstName: action.firstName,
        email: action.email,
        password: action.password,
      };
    case ACCEPT_TERMS_REQUESTED:
      return {
        ...state,
        termsAndConditions: {
          ...state.termsAndConditions,
          isSubmitting: true,
        },
      };
    case ACCEPT_TERMS_RESPONDED:
      return {
        ...state,
        termsAndConditions: {
          ...state.termsAndConditions,
          isSubmitting: false,
          accepted: action.accepted,
        },
      };
    case 'persist/REHYDRATE': {
      return {
        ...initialState,
        ...compose(omit(['isLoading']), pathOr(initialState, ['payload', 'login']))(action),
      };
    }

    default:
      return state;
  }
};

const getUserType = pathOr('', ['login', 'userType']);
const getUser = pathOr(null, ['login', 'user']);

const getForm = pathOr({}, ['login', 'form']);
const getError = pathOr('', ['login', 'error']);
const getIsLoading = pathOr('', ['login', 'isLoading']);
export const getIsTempPass = pathOr(false, ['login', 'session', 'user', 'isTempPass']);
export const getAccessToken = pathOr({}, ['login', 'session', 'tokens', 'access']);
export const getVendor = pathOr(0, ['login', 'user', 'profiles', 'activeProfile', 'vendor']);
export const getUserRole = compose(pathOr(0, ['personnel_data', 'role_id']), getVendor);
export const getActiveVendor = pathOr(null, [
  'login',
  'user',
  'profiles',
  'activeProfile',
  'vendor',
  'vendor_id',
]);

export const getAllGroups = compose(pathOr([], ['groups']), getVendor);
const getDefaultGroup = compose(head, pathOr([], ['groups']));
export const getDefaultGroupId = compose(
  propOr(null, 'dispatch_group_id'),
  getDefaultGroup,
  getVendor,
);
export const getDefaultGroupName = compose(
  propOr(null, 'dispatch_group_name'),
  getDefaultGroup,
  getVendor,
);

export const getPersonnelData = compose(pathOr({}, ['personnel_data']), getVendor);

const getOnboardingComplete = pathOr(false, ['settings', 'onboardingCompleted']);

export const getLoginStatus = pathOr('login', ['login', 'loggedIn']);
// export const getTermsStatus = pathOr(true, [
//   'login',
//   'user',
//   'profiles',
//   'profileInfo',
//   'terms_and_conditions',
//   'accepted',
// ]);

export const loginSelector = createStructuredSelector({
  version: getVersionNumber,
  buildNumber: getBuildNumber,
  userType: getUserType,
  user: getUser,
  form: getForm,
  error: getError,
  isLoading: getIsLoading,
  onboardingComplete: getOnboardingComplete,
  connectionStatus: getConnectionStatus,
});
