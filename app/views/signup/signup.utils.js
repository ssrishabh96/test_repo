// @flow
import messages from '../../constants/messages';
import { FormValuesType } from './types';

export const errorMapper = (statusCode?: number): string => {
  switch (statusCode) {
    case 422: return messages.signup.error422;
    case 500: return messages.signup.error500;
    case 400: return messages.signup.error400;
    default:
      return messages.signup.defaultError;
  }
};

export const validate = (values: FormValuesType) => {
  const errors = {};
  if (!values.firstName) errors.firstName = 'First name required';
  if (!values.lastName) errors.lastName = 'Last name required';

  if (!values.emailId) {
    errors.emailId = 'Email required';
  } else if (values.emailId && !validateEmail(values.emailId)) {
    errors.emailId = 'example@domain.com';
  }

  if (!values.userTypeCode) errors.userTypeCode = 'User Type required';

  if (!values.password) errors.password = 'Password required';
  if (!validatePassword(values.password)) errors.password = 'Please follow password constraints';
  if (values.password !== values.confirmPassword) errors.confirmPassword = 'Please enter the same password as above';
  return errors;
};

export const validateEmail = (email: string): boolean => {
  // eslint-disable-next-line
  const emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRe.test(email);
};

export const validatePassword = (password: string): boolean => {
  const passwordRe = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  return passwordRe.test(password);
};
