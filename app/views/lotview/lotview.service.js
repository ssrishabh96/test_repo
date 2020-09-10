import { transporterApi } from 'services/xhr';
import { mapLotNotes, mapCharges, mapLotItem } from 'utils/mappers/lotMapper';

export const getLotNotes = assignmentDetailId =>
  transporterApi.get(`transporter/assignments/${assignmentDetailId}/event_notes`).then((response) => {
    if (response.status === 200 && response.data.status === 'success') {
      return { lotNotes: mapLotNotes(response.data.data.auto_notes) };
    }
  });

export const getLotCharges = assignmentDetailId =>
  transporterApi.get(`transporter/assignments/${assignmentDetailId}/charges`).then((response) => {
    if (response.status === 200 && response.data.status === 'success') {
      return { charges: response.data.data };
    }
    return { charges: {} };
  });

export const getLotInfo = assignmentDetailId =>
  transporterApi.get(`transporter/assignments/${assignmentDetailId}`).then((response) => {
    if (response.status === 200 && response.data.status === 'success') {
      return { lotInfo: mapLotItem(response.data.assignment) };
    }
    return { lotInfo: {} };
  });

export const postRequestForPaperWork = (assignmentDetailId, params) =>
  transporterApi.post(`transporter/assignments/${assignmentDetailId}/paper_work`, params);
