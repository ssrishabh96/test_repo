import { transporterApi } from 'services/xhr';

import { mapTrips } from 'utils/mappers/tripMapper';

export const getTripsCommonService = params =>
  transporterApi.post('transporter/trips', params).then((response) => {
    if (response.status === 200) {
      if (response.data.status === 'success') {
        return { trips: mapTrips(response.data.data), count: response.data.total_count };
      }
    }
    return response.date;
  });

export const getFacetCount = params =>
  transporterApi.post('transporter/facet_counts', params).then((res) => {
    if (res.status === 200) {
      if (res.data.status === 'success') {
        return { data: res.data.data };
      }
    }
  });

export const tripAction = (tripIds, action, params) =>
  transporterApi
    .patch('/transporter/trips/transition', {
      trip_ids: tripIds,
      action,
      ...params,
    })
    .then((response) => {
      if (response.status === 200 && response.data.status === 'success') {
        return response.data;
      }
      return response.data;
    })
    .catch(error => error.response);

export const distributeTrips = data => transporterApi.patch('transporter/trips/distribute', data);
