import { LotItemType } from '../lotlist/components/LotItem/types';

export type TripType = {
  tripId: string,
  lots: Array<LotItemType>,
  tripName: string,
};
