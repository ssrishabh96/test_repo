// @flow
/* eslint-disable no-console */

import { transporterApi } from 'services/xhr';
import { issuesQueueMapper, issueMapper } from 'utils/mappers/issuesQueueMapper';
import { mapLotListResponse } from 'utils/mappers/lotMapper';

export const fetchIssuesQueue = (data: Object) =>
  transporterApi
    .post('/transporter/issues', data)
    .then((response: Object) => {
      if (response.status === 200 && response.data.status === 'success') {
        const data = issuesQueueMapper(response.data.data);
        return { status: 'success', data, count: response.data.total_count };
      }
      return { error: 'Error fetching issues', data: null };
    })
    .catch((error: Object) => error.response);

export const fetchPartialTrips = (params: Object) =>
  transporterApi
    .post('/transporter/assignments', {
      ...params,
      skip_pagination: false,
      filter_by: {
        is_partial_trip_lot: true,
      },
    })
    .then((response: Object) => {
      if (response.status === 200 && response.data.status === 'success') {
        return {
          status: 'success',
          data: mapLotListResponse(response.data.data),
          count: response.data.total_count,
        };
      }
      return { error: 'Error fetching partial trip lots', data: null };
    })
    .catch((error: Object) => error.response);

export const fetchIssueLotDetail = (assignmentDetailId: number) =>
  transporterApi
    .get(`/transporter/assignments/${assignmentDetailId}/issues`)
    .then((response: Object) => {
      if (response.status === 200 && response.data.status === 'success') {
        const data = issueMapper(response.data.data);
        console.log('data::ws ', data);
        return { status: 'success', data, count: response.data.count };
      }
      return response.data;
    })
    .catch((error: Object) => error.response);

export const readResolvedIssue = (assignmentDetailId: number, messageId: number) =>
  transporterApi
    .patch(`transporter/assignments/${assignmentDetailId}/issues/${messageId}/read`)
    .then((response: Object) => {
      if (response.status === 200 && response.data.status === 'success') {
        return response.data;
      }
      return { error: 'Error marking resolved issue as read', data: null };
    })
    .catch((error: Object) => error.response);

export const selfClearIssueOnLot = (assignmentDetailId: number) =>
  transporterApi
    .patch(`transporter/assignments/${assignmentDetailId}/issues/resolve`, {
      resolution_action: 'cancel',
    })
    .then((response: Object) => {
      if (response.status === 200 && response.data.status === 'success') {
        return response.data;
      }
      return { error: 'Error marking issue as resolved', data: null };
    })
    .catch((error: Object) => error.response);

export const resolveIssueOnLot = (assignmentDetailId: number, data: Object) =>
  transporterApi
    .patch(`transporter/assignments/${assignmentDetailId}/issues/resolve`, data)
    .then((response: Object) => {
      if (response.status === 200 && response.data.status === 'success') {
        return response.data;
      }
      return { error: 'Error marking issue as resolved', data: null };
    })
    .catch((error: Object) => error.response);

export const escalateIssue = (assignmentDetailId: number) =>
  transporterApi
    .patch(`/transporter/assignments/${assignmentDetailId}/issues/escalate`)
    .then((response: Object) => response.data)
    .catch((error: Object) => error.response);
