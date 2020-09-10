import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { transporterApi, unregisterApi } from 'services/xhr';
import { mapHomeCountsResponse } from 'utils/mappers/homeMapper';

export const getHomeScreenCounts = () =>
  transporterApi.get('/transporter/quick_counts').then((response) => {
    if (response.status === 200 && response.data.status === 'success') {
      const counts = mapHomeCountsResponse(response.data.data);
      return counts;
    }
    return response;
  });

export const registerForNotifications = (token, email) =>
  transporterApi.post('transporter/devices/notifications/register', {
    email,
    app_code: 'TA',
    device_type_code: 'Mobile',
    device_description: DeviceInfo.getDeviceId(),
    device_os_code: Platform.OS,
    device_token: token,
  });

export const unregisterForNotifications = () =>
  unregisterApi.post('transporter/devices/notifications/unregister');
