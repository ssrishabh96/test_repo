import { authApi, transporterApi } from 'services/xhr';

const buildFormData = (data) => {
  const form = new FormData();
  Object.keys(data).forEach((key) => {
    form.append(key, data[key]);
  });
  return form;
};

export const authenticateUser = (username, password) => {
  const data = {
    username,
    password,
  };
  // const formData = buildFormData(data);
  return authApi.post('/transporter/login', data);
  // return Promise.resolve({
  //   status: 200,
  //   data: {
  //     access_token: 'abc',
  //     token_type: 'bearer',
  //     refresh_token: 'xyz',
  //     expires_in: 86399,
  //     scope: 'login',
  //     entity_country: 'US',
  //     entity_type: 'externaluser',
  //     entity_id: 17,
  //     entity_name: 'John Doe',
  //   },
  // });
};

export const getUserInfo = () => transporterApi.get('/transporter/current_user');

export const updatePassword = (old_password, new_password) => {
  const data = { old_password, new_password };
  return authApi.put('/transporter/password', data);
};

export const forgotPassword = email => authApi.post('/transporter/reset_password', { email });

export const acceptTermsAndConditions = () => transporterApi.post('/transporter/conditions');
