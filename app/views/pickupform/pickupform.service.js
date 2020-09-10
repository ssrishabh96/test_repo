import { transporterApi } from 'services/xhr';
import { TRANSPORTER_API } from 'config';
import { NativeModules, Platform } from 'react-native';
import { getAccessToken, getActiveVendor } from '../login/login.redux';
import { store } from '../../../app/index';

const FileUpload = NativeModules.FileUpload;
const buildFormData = (data) => {
  const form = new FormData();
  Object.keys(data).forEach((key) => {
    form.append(key, data[key]);
  });
  return form;
};

export const uploadImage = (image, assignmentId, index) =>
  new Promise((resolve, reject) => {
    const accessToken = getAccessToken(store.getState()).value;
    const vendorId = getActiveVendor(store.getState());
    const url = `${TRANSPORTER_API.baseURL}/transporter/assignments/${assignmentId}/images`;
    const imageFields = {
      document_type: image.documentType,
      sequence: `${index + 1}`,
    };
    const params = {
      uploadUrl: url,
      method: 'POST', // default 'POST',support 'POST' and 'PUT'
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
        Connection: 'close',
        'X-Vendor-Id': vendorId.toString(),
      },
      fields: imageFields,
      files: [
        {
          filename: image.filename, // fileName,
          filepath: image.filepath, // require, file absoluete path
        },
      ],
    };
    console.log('uploading image ', url, image.documentType);
    if (Platform.OS === 'ios') {
      const data = new FormData();
      data.append('file', { uri: image.filepath, name: image.filename, type: 'image/jpg' });
      data.append('document_type', image.documentType);
      data.append('sequence', `${index + 1}`);
      transporterApi
        .post(`transporter/assignments/${assignmentId}/images`, data, {
          headers: {
            'Content-Type': 'multipart/form-data;',
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data.status === 'success') {
            console.log('Image upload success', image.documentType, response);
            return resolve(response);
          }
          console.log('ERROR - Image upload failed', image.documentType, response);
          return reject(response);
        })
        .catch(error => reject(error));
    }
    if (Platform.OS === 'android') {
      FileUpload.upload(params, (err, result) => {
        if (err) {
          console.log('ERROR - Image upload failed', image.documentType, err);
          return reject(err);
        }
        console.log('Image upload', result);
        return resolve(result);
      });
    }
  });

export const postPickupForm = ({ assignmentId, data }) =>
  transporterApi.post(`transporter/assignments/${assignmentId}/form`, data);
