export const initialState = {
  isLoading: false,
  lot: {},
  charges: { isLoading: false, data: {} },
  lotInfo: { isLoading: false, data: {} },
  lotNotes: { isLoading: false, data: [] },
};

export const MOVE_TO_INPROGRESS_REQUESTED = 'MOVE_TO_INPROGRESS_REQUESTED';
export const MOVE_TO_INPROGRESS_RESPONDED = 'MOVE_TO_INPROGRESS_RESPONDED';

export const LOT_CHARGES_REQUESTED = 'LOT_CHARGES_REQUESTED';
export const LOT_CHARGES_RESPONDED = 'LOT_CHARGES_RESPONDED';

export const LOT_INFO_REQUESTED = 'LOT_INFO_REQUESTED';
export const LOT_INFO_RESPONDED = 'LOT_INFO_RESPONDED';
export const LOT_INFO_RESPONDED_ERROR = 'LOT_INFO_RESPONDED_ERROR';

export const LOT_NOTES_REQUESTED = 'LOT_NOTES_REQUESTED';
export const LOT_NOTES_RESPONDED = 'LOT_NOTES_RESPONDED';

export const CLEAR_LOT_INFO = 'CLEAR_LOT_INFO';
export const REMOVE_LOT_INFO_FROM_CACHE = 'REMOVE_LOT_INFO_FROM_CACHE';
