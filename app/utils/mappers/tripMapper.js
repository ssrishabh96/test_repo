import { map, evolve, compose } from 'ramda';
import { renameKeys } from 'utils/commonUtils';
import { mapLotListResponse as mapLotList } from './lotMapper';

const tripMap = {
  trip_id: 'tripId',
  trip_name: 'tripName',
  assignments: 'lots',
};
const mapLots = evolve({ lots: mapLotList });
export const mapTrips = map(compose(mapLots, renameKeys(tripMap)));
