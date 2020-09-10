/* eslint-disable max-len */

import { map, compose, evolve, mapObjIndexed, omit } from 'ramda';
import { renameKeys } from 'utils/commonUtils';

/*
  the below source address has paymenttypesaccepted,
  which will be available for pickup lots. Need to rethink on the implementation
*/
// const sourceAddressMap = {
//   accurate: true,
//   city: 'HOUSTON',
//   crossstreet: '',
//   exists: true,
//   lat: 29.7240933,
//   line1: '5329 KIRBY DR.',
//   line2: '',
//   lng: -95.4179858,
//   name: 'RIVER OAKS PAINT&BODY',
//   pano_id: 'ZSGzwxz5CxIEp7xO9Ql5wQ',
//   partial_match: true,
//   residence: 'Y',
//   state: 'TX',
//   zip: '77005',
//   zpp: '',
//   paymentTypesAccepted: {
//     card: true,
//     check: true,
//     cash: true,
//   },
// };

const lotMap = {
  cash_tag: 'cashTag',
  // destination: destination: {},
  // jobUpdateTime: '2018-01-10T19: 38: 27Z',
  // source: {},
  // subhaulerUser: 'A & S TOW',
  damage_type_code: 'damageCode',
  lot_trip_key: 'lotTripId',
  dispatch_trip_id: 'tripId',
  forms: {},
  is_partial_lot: 'isPartialTripLot',
  issue: {},
  is_towable: 'isTowable',
  has_keys: 'hasKeys',
  loss_type_code: 'lossType',
  lot_description: 'description',
  lot_model_year: 'year',
  lot_number: 'number',
  lot_stage: 'lotStage',
  // lot_trip_status: 'status',
  // dispatch_status: 'lotStatus',
  dispatch_status: 'lotStatus',

  lot_trip_zone: 'tripZone',
  lot_type: 'vehicleType',

  // make: 'AUDI', // will be coming soon
  lot_make: 'make',
  // model: 'A7 PRESTIG', // will be coming soon
  lot_model: 'model',

  original_destination_key: 'destinationLocationId',
  original_source_key: 'sourceLocationId',
  pickupPhoneNumber: {}, // not present. Assuming one should be using source/destination.phone_number based on the trip type
  promised_date: 'promisedTripDate',
  responsible_facility_id: 'yardNumber',
  scheduled_time_from: 'scheduledTimeFrom',
  scheduled_time_to: 'scheduledTimeTo',
  seller_number: 'sellerNumber',
  seller_reference: 'sellerReference',
  suffix: 'X', // will be coming soon
  tow_type_code: 'towType',
  trip_status_code: 'tripStatus',
  trip_type_code: 'tripType',
  form_type: 'formType',
  updated_at: 'clientUpdateTime',
  updated_by: 'updateByUser',
  completed_date: 'completionDate',
  member_number: 'memberNumber',
  member_name: 'memberName',
  seller_name: 'sellerName',
  adjuster_name: 'adjusterName',
  adjuster_phone_number: 'adjusterNumber',
  insured_name: 'insuredName',
  owner_name: 'ownerName',
  owner_phone_number: 'ownerNumber',
  claim_number: 'claimNumber',
  policy_number: 'policyNumber',
  payment_mode: 'paymentMode',
  cash_status: 'cashStatus',
};

const sanitize = evolve({ lotStatus: parseInt });
export const mapLotItem = renameKeys(lotMap);
export const mapLotListResponse = map(compose(sanitize, mapLotItem));

const lotNotesMap = {
  lot_number: 'lotNumber',
  note: 'notes',
  created_at: 'createTime',
};

export const mapLotNotes = map(renameKeys(lotNotesMap));

const renameStorage = (prefix, ob) => {
  const keyMap = mapObjIndexed((val, key) => `${prefix}_${key}`)(ob);
  return renameKeys(keyMap)(ob);
};

export const mapCharges = (chargesData) => {
  const newCharges = {
    ...chargesData,
    ...renameStorage('storage', chargesData.storage),
    ...renameStorage('second_storage', chargesData.second_storage),
  };
  return omit(['storage', 'second_storage'])(newCharges);
};
