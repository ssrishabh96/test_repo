/* eslint-disable no-return-assign */
/* eslint-disable no-console */

import uuid from 'uuid';
import axios from 'axios';
import { TRANSPORTER_API } from 'config';

import DeviceInfo from 'react-native-device-info';
import { assocPath, pathOr } from 'ramda';

import { getAccessToken, getActiveVendor } from 'views/login/login.redux';
import { getUserLocation } from 'views/settings/settings.redux';
import { store } from '../../app/index';

import { signoutUser } from 'views/login/login.action';

import { buildErrorMessage_v1, errorMessageMap } from 'utils/mappers/errorMessageMapper';

const logRequest = (request) => {
  const { method, baseURL, url, headers, params, data } = request;
  console.log('API', 'Request', method, baseURL, url, headers, params, data, request);
};

export const authApi = axios.create({
  baseURL: TRANSPORTER_API.baseURL,
});

export const transporterApi = axios.create({
  baseURL: TRANSPORTER_API.baseURL,
  timeout: 60 * 1000,
});

export const unregisterApi = axios.create({
  baseURL: TRANSPORTER_API.baseURL,
  timeout: 60 * 1000,
});

const handleSecureRequest = (config) => {
  const state = store.getState();
  const accessToken = getAccessToken(state).value;
  const { headers } = config;
  if (accessToken) {
    // added accessToken to header
    headers.Authorization = `Bearer ${accessToken}`;
    headers['X-Vendor-Id'] = getActiveVendor(state);
    headers['X-device-id'] = DeviceInfo.getUniqueID();

    const { latitude, longitude } = getUserLocation(state);
    headers['X-Lat'] = latitude;
    headers['X-Long'] = longitude;

    headers.correlationID = `Tranporter-Mobile-uuid-${uuid.v1()}`; // add time based uuid
  }
  logRequest(config);
  return config;
};

const handleResponse = (response) => {
  const { data, status, config } = response;
  console.log('Response');
  logRequest(config);
  console.log('API', 'Response', data, status, config);
  return response;
};
const handleRequestError = (error) => {
  console.log('API - Error', error);
  throw error;
};
const handleResponseError = (error) => {
  const correlationID = pathOr('N/A', ['config', 'headers', 'correlationID'])(error);

  if (error.response && error.response.status === 401) {
    console.log('API - Token Expired - signing out user');
    store.dispatch(signoutUser());
  }

  if (error.response && error.response.status === 404) {
    console.log('API - 404');
    const serviceError = `Correlation-Id: ${correlationID} \n\n 404: Service not found`;
    const obj = assocPath(['response', 'data', 'parsedErrorMessage'], serviceError)(error);
    throw obj;
  }

  // add checks for other status codes ? 501, 500, etc

  const url = pathOr('N/A', ['config', 'url'])(error);
  if (!error.response) {
    console.log('API - Generic Error', error);
    const networkError = `Correlation-Id: ${correlationID} \n\n ${
      errorMessageMap['Network Error']
    }: ${url}`;
    const obj = assocPath(['response', 'data', 'parsedErrorMessage'], networkError)(error);
    throw obj;
  } else {
    const { data, status } = error.response;
    console.log('API - Error', data, status);

    const parsedErrorMessage = `Correlation-Id: ${correlationID} \n URL: ${
      url
    } \n\n ${buildErrorMessage_v1(data.errors)}`;

    const obj = assocPath(['response', 'data', 'parsedErrorMessage'], parsedErrorMessage)(error);
    throw obj;
  }

  // throw error;
};
const handleResponseErrorWithoutSignout = (error) => {
  if (!error.response) {
    console.log('API - Generic Error', error);
  } else {
    const { data, status } = error.response;
    console.log('API - Error', data, status);
  }
  throw error;
};

unregisterApi.interceptors.request.use(handleSecureRequest, handleRequestError);
unregisterApi.interceptors.response.use(handleResponse, handleResponseErrorWithoutSignout);

transporterApi.interceptors.request.use(handleSecureRequest, handleRequestError);
transporterApi.interceptors.response.use(handleResponse, handleResponseError);

authApi.interceptors.request.use(handleSecureRequest, handleRequestError);
authApi.interceptors.response.use(handleResponse, handleResponseError);
