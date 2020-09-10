// @flow

import { transporterApi } from 'services/xhr';

import { mapTrips } from 'utils/mappers/declinedTripsMapper';

export const fetchDeclinedTripsQueue = (params: Object) =>
  transporterApi
    .post('/transporter/trips/rejected', params)
    .then((response: Object) => {
      if (response.status === 200) {
        if (response.data.status === 'success') {
          const data = mapTrips(response.data.data);
          return { status: 'success', data, count: response.data.total_count };
        }
        return { error: 'Error fetching issues', data: null };
      }
      return { error: 'Error fetching issues', data: null };
    })
    .catch((error: Object) => error.response);

export const reclaimTrip = (tripIds: Array<number>) =>
  transporterApi
    .patch('/transporter/trips/reclaim', {
      trip_ids: tripIds,
    })
    .then((response: Object) => {
      if (response.status === 200 && response.data.status === 'success') {
        return { status: 'success' };
      }
      return response; // return { status: "error" };
    })
    .catch((error: Object) => error.response);

export const overrideTripRejection = (tripId: number, reason: string) =>
  transporterApi
    .patch(`/transporter/trips/${tripId}/override_rejection`, {
      override_reason: reason,
    })
    .then((response: Object) => {
      if (response.status === 200 && response.data.status === 'success') {
        return { data: 'success' };
      }
      return response;
    })
    .catch((error: Object) => {
      console.log('error in ws: ', error.response);
      return error.response;
    });
