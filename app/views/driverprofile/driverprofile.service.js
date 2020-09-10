import { transporterApi } from 'services/xhr';

export const updateDriverProfile = (vendorId, personnelId, payload) =>
  transporterApi
    .patch(`/transporter/vendors/${vendorId}/personnel/${personnelId}`, payload)
    .then(response => response.data)
    .catch(error => error.response);
