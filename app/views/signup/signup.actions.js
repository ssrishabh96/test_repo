// @flow

import { Dispatch, FormValuesType } from './types';
import {
  SIGNUP_ACTION_INIT,
  SIGNUP_ACTION_SUCCESS,
  SIGNUP_ACTION_FAILURE,
  CLEAR_SIGNUP_MESSAGES,
} from './signup.constants';
import * as signupService from './signup.service';
import { errorMapper } from './signup.utils';

export const signUpInit = () => ({
  type: SIGNUP_ACTION_INIT,
});

export const signUpSuccess = (message: string) => ({
  type: SIGNUP_ACTION_SUCCESS,
  message,
});

export const signUpFailure = (error: Object | string) => ({
  type: SIGNUP_ACTION_FAILURE,
  error,
});

export const submitSignUpForm = (data: FormValuesType) => (dispatch: Dispatch) => {
  dispatch(signUpInit());
  signupService
    .signUp(data)
    .then((resp: Object) => {
      if (resp.status === 'success') {
        dispatch(signUpSuccess(resp.message));
      }
    })
    .catch((err: Object) => {
      const statusCode = (err && err.response && err.response.status) || 0;
      dispatch(signUpFailure(errorMapper(statusCode)));
    });
};

export const clearMessages = () => ({
  type: CLEAR_SIGNUP_MESSAGES,
});
