import { LOT_STATUSES } from 'constants/Lot';

export const getNextLocationFromLot = (lot) => {
  if (lot.formType === 'P') {
    return lot.lotStatus <= LOT_STATUSES.AWAITING_FORM_SUBMISSION ? lot.source : lot.destination;
  }
  // else: D, B, S and T are same?
  return lot.lotStatus <= LOT_STATUSES.AWAITING_IN_PROGRESS ? lot.source : lot.destination;
};
