import { map, compose, evolve } from 'ramda';
import { renameKeys } from 'utils/commonUtils';
import { mapLotListResponse as mapLotList } from './lotMapper';

const declinedTripMapper = {
  trip_id: 'tripId',
  trip_date: 'tripDate',
  trip_type_code: 'tripTypeCode',
  trip_name: 'tripName',
  facility_id: 'facilityId',
  trip_status: 'tripStatus',
  vendor_id: 'vendorId',
  dispatch_group_id: 'dispatchGroupId',
  vendor_personnel_id: 'vendorPersonnelId',
  tow_truck_type: 'towTruckType',
  rejection_reason: 'rejectionReason',
  override_reason: 'overrideReason',
  created_by: 'createdBy',
  created_at: 'createdAt',
  updated_by: 'updatedBy',
  updated_at: 'updatedAt',
  source_system: 'sourceSystem',
  source_entry_date: 'sourceEntryDate',
  responsible_party_name: 'responsiblePartyName',
  assignments: 'lots',
};

const mapLots = evolve({ lots: mapLotList });
export const mapTrips = map(compose(mapLots, renameKeys(declinedTripMapper)));
