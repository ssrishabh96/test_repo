import { head, compose, join, pathOr, keys, mapObjIndexed, mergeAll } from 'ramda';

import { capitalize } from 'utils/commonUtils';

export const errorMessageMap = {
  /* Common Messages */
  'Network Error': 'Cannot connect to host',
  /* Login messages */
  invalid_grant: 'Username or Password is incorrect',
  'is not valid and no records exist':
    'This account is inactive. Please contact your administrator',
  /* Change Password Messages */
  'please provide a valid old password': 'Old password is incorrect.',
};
const getMessage = (e) => {
  if (e) {
    return Object.entries(e).map(
      ([key, value]) => errorMessageMap[key] || errorMessageMap[head(value)] || head(value),
    );
  }
  return [];
};
const getErrors = pathOr([], ['error', 'response', 'data', 'errors']);
export default compose(join(' | '), getMessage, head, getErrors);

/**
 * @description Generic service error response mapper
 * @param {Array<Object>} data
 * @returns An Array ["ErrorKey1: ErrorMessage1", "ErrorKey2: ErrorMessage2"]
 */
export const buildErrorMessage_v1 = (data) => {
  const response = [];

  const getErrorString = (value, key) => response.push(`${capitalize(key)} - ${capitalize(value)}`);

  compose(mapObjIndexed(getErrorString), mapObjIndexed(value => head(value)), mergeAll)(data);

  let parsedErrorMessage = '';
  response.forEach(err => (parsedErrorMessage += `${err}\n`));
  return parsedErrorMessage;
};

const splitErrorTextForFields = l =>
  // if (l.includes(':')) {
  //   const [msg, fields] = l.split(':');
  //   console.log('fields', l.split(':'));
  //   return `${fields} - ${msg}`;
  // }
  l;

// parse error object of type [{ key: [] }] or [{ key: '' }] or [[{}]]
export const buildErrorMessage = (errorData) => {
  if (!errorData) {
    return '';
  }
  const { errors, corelation_id } = errorData;
  if (!(errors instanceof Array)) {
    // return '';
    return JSON.stringify(errorData); // for debugging
  }
  const parsedErrors = errors
    .map((first) => {
      if (first instanceof Array) {
        const kMessage = first.map(splitErrorTextForFields);
        return `${kMessage}`;
      }
      const second = keys(first).map((k) => {
        if (typeof first[k] === 'string') {
          return first[k];
        }
        const kMessage = first[k].map(splitErrorTextForFields);
        return `${k}: ${kMessage}`;
      });
      return second.join('\n');
    })
    .join('\n');
  const errorId = corelation_id ? `\nError-Id: ${corelation_id}` : '';
  return `${parsedErrors}${errorId}`;
};
