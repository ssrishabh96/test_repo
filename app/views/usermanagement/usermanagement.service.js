import { transporterApi } from 'services/xhr';
import { groupsDataMapper, personnelDataMapper } from 'utils/mappers/userManagementMapper';
import { vendorMapper } from 'utils/mappers/vendorMapper';

/**
 * Request pcard status => WOPA:
    [W]: Waiting means requested
    [O]: Ordered means accounting has ordered
    [P]: Pending means it showed up and on the way to yard
    [A]: means the GM has activated it
* Delete/Cancel PCard => Active to Destroyed
*/

export const getGroups = vendorId =>
  transporterApi
    .get(`/transporter/vendors/${vendorId}/groups`)
    .then((response) => {
      if (response.status === 200 && response.data.status === 'success') {
        const data = groupsDataMapper(response.data.data);
        return { data };
      }
      return response;
    })
    .catch(error => error.response);

export const getPersonnel = vendorId =>
  transporterApi
    .get(`/transporter/vendors/${vendorId}/personnel`)
    .then((response) => {
      if (response.status === 200 && response.data.status === 'success') {
        const data = personnelDataMapper(response.data.data);
        // Filter out only driver role users to show in the UM driver tab
        const filteredData = data.filter(personnel => personnel.role === 'DRIVER');
        return { data: filteredData };
      }
      return response;
    })
    .catch(error => error.response);

export const getVendorInfo = vendorId =>
  transporterApi
    .get(`/transporter/vendors/${vendorId}`)
    .then((response) => {
      if (response.status === 200) {
        const data = vendorMapper(response.data);
        return { status: 200, data };
      }
      return response;
    })
    .catch(error => error.response);

export const addDriver = (data, vendorId) =>
  transporterApi
    .post(`/transporter/vendors/${vendorId}/personnel`, data)
    .then((response) => {
      if (response.status === 200) {
        return { status: 'success' };
      }
      return response;
    })
    .catch(error => error.response);

export const updateDriver = (data, vendorId, personnelId) =>
  transporterApi
    .patch(`/transporter/vendors/${vendorId}/personnel/${personnelId}`, data)
    .then((response) => {
      if (response.status === 200) {
        return { status: 'success' };
      }
      return response;
    })
    .catch(error => error.response);

export const updatePersonnelData = (vendorId, personnelId, data) =>
  transporterApi
    .patch(`/transporter/vendors/${vendorId}/personnel/${personnelId}`, data)
    .then((response) => {
      if (response.status === 200) {
        return { status: 'success', data: response.data };
      }
      return response;
    })
    .catch(error => error.response);

export const requestPcard = (vendorPersonnelId, yardNumber) =>
  transporterApi
    .post(`/transporter/personnel/${vendorPersonnelId}/pcard?yardNumber=${yardNumber}`)
    .then((response) => {
      if (response.status === 200) {
        return { status: 'success', data: response.data };
      }
      return response;
    })
    .catch(error => error.response);

export const activateInactivePcard = (vendorPersonnelId, status, last4) =>
  transporterApi
    .put(`/transporter/personnel/${vendorPersonnelId}/pcard/status?status=${status}&last4=${last4}`)
    .then((response) => {
      if (response.status === 200) {
        return { status: 'success', data: response.data };
      }
      return response;
    })
    .catch(error => error.response);

export const destroyPcard = vendorPersonnelId =>
  transporterApi
    .delete(`/transporter/personnel/${vendorPersonnelId}/pcard`)
    .then((response) => {
      if (response.status === 200) {
        return { status: 'success', data: response.data };
      }
      return response;
    })
    .catch(error => error.response);
