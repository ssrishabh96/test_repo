// @flow
import axios from 'axios';
import { FormValuesType } from './types';

const BASE_API_URL = 'http://externalauth.c-qa4.svc.rnq.k8s.copart.com:8080';

export const signUp = (formData: FormValuesType) => {
  const API_URL = `${BASE_API_URL}/externaluser/v1/register`;
  const config = {
    headers: {
      countryCode: 'US',
      'Content-Type': 'application/json',
    },
  };
  return axios.post(API_URL, formData, config).then(resp => resp.data);
};
