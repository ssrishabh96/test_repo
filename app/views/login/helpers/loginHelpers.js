import { pathOr, compose, join, head, propEq, find } from 'ramda';

export const buildSession = (data) => {
  const now = Date.now();
  const tokens = {
    access: {
      type: data.token_type,
      value: data.access_token,
      expiresIn: data.expires_in,
      timestamp: now,
      expirationTimestamp: now + data.expires_in * 1000,
    },
    refresh: {
      type: data.token_type,
      value: data.refresh_token,
    },
  };
  const user = {
    id: data.entity_id,
    name: data.entity_name,
    country: data.entity_country,
    type: data.entity_type,
    isTempPass: data.temp_password_flag,
  };
  return {
    tokens,
    user,
  };
};

export const checkIfSingleVendorPresent = (res) => {
  if (res.vendors.length === 1) {
    const vendor = res.vendors[0];
    return {
      result: true,
      vendor,
    };
  }
  return { result: false, vendor: null };
};

export const getActiveVendorId = pathOr(-1, [
  'login',
  'user',
  'profiles',
  'activeProfile',
  'vendor',
  'vendor_id',
]);

export const getVendorByVendorId = (res, id) => find(propEq('vendor_id', id))(res.vendors);
