// @flow
import type { Lot } from './Lot';

export type Trip = {
  tripId: string,
  tripName: string,
  lots: Array<Lot>,
  distributable: boolean,
  rejectionReason: string,
  responsiblePartyName: string,
};
