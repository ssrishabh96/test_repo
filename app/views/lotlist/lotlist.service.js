import { transporterApi } from 'services/xhr';
import { mapLotListResponse } from 'utils/mappers/lotMapper';

export const transitionLotCommonService = (dispatchAssignments, action) =>
  transporterApi.patch('transporter/assignments/transition', {
    assignment_detail_ids: dispatchAssignments,
    action,
  });

export const getAssignmentsCommonService = params =>
  // transporterApi.post('transporter/assignments', params).then((response) => {
  transporterApi.post('transporter/assignments', params).then((response) => {
    if (response.status === 200) {
      if (response.data.status === 'success') {
        return {
          lots: mapLotListResponse(response.data.data),
          totalCount: response.data.total_count,
        };
      }
    }
    return response.data;
  });

export const distributeAssignments = data =>
  transporterApi.patch('transporter/assignments/distribute', data);

export const submitIssueForLot = (lot, issue) =>
  transporterApi
    .post(`transporter/assignments/${lot.dispatch_assignment_detail_id}/issues`, { ...issue })
    .then((response) => {
      if (response.status === 200 && response.data.status === 'success') {
        return response;
      }
      return response;
    })
    .catch(error => error.response);
