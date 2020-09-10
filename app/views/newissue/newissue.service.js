import { transporterApi } from '../../services/xhr';

export const fetchAvailableIssues = dispatchAssignmentDetailId =>
  transporterApi
    .get(`transporter/assignments/${dispatchAssignmentDetailId}/available_issues`)
    .then(response => response)
    .catch(error => error.response);

export const fetchDeclineTripReasons = () =>
  transporterApi
    .get('transporter/decline_reasons')
    .then(response => response)
    .catch(error => error.response);
