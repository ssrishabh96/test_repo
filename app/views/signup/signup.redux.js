// @flow
import { pathOr } from 'ramda';
import { createStructuredSelector } from 'reselect';
import {
  initialState,
  SIGNUP_ACTION_INIT,
  SIGNUP_ACTION_SUCCESS,
  SIGNUP_ACTION_FAILURE,
  CLEAR_SIGNUP_MESSAGES,
} from './signup.constants';

import {
  ActionType,
  ReducerStateType,
} from './types';

const getIsLoading = pathOr('', ['signup', 'isLoading']);
const getError = pathOr('', ['signup', 'err']);
const getMessage = pathOr('', ['signup', 'message']);
const getIsRegistered = pathOr('', ['signup', 'isRegistered']);

export const singUpSelector = createStructuredSelector({
  isLoading: getIsLoading,
  err: getError,
  message: getMessage,
  isRegistered: getIsRegistered,
});

export const signupReducer = (state: ReducerStateType = initialState, action: ActionType): ReducerStateType => {
  switch (action.type) {
    case SIGNUP_ACTION_INIT: {
      return {
        ...state,
        isLoading: true,
        err: null,
      };
    }
    case SIGNUP_ACTION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        err: null,
        message: action.message,
        isRegistered: true,
      };
    }
    case SIGNUP_ACTION_FAILURE: {
      return {
        ...state,
        isLoading: false,
        message: null,
        err: action.error,
      };
    }
    case CLEAR_SIGNUP_MESSAGES: {
      return {
        ...state,
        message: null,
        err: null,
        isRegistered: false,
      };
    }
    default:
      return state;
  }
};
