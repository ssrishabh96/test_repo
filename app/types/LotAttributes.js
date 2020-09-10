// @flow

export type LotTripTypes = 'P' | 'D' | 'B' | 'S' | 'T';
// pickup | deliveryToBusiness | deliveryToDefault | owner retain | transport

export type LotTripStatusCode = 'W' | 'I' | 'P';
export type LotTowTypes = 'S' | 'M' | 'H';
export type LotPaymentTypesAccepted = {
  card: boolean,
  check: boolean,
  cash: boolean,
};
export type LotPaymentModes = 'CASH' | 'CARD/CHECK';
export type LotAddress = {
  accurate: boolean,
  city: string,
  crossstreet: string,
  exists: boolean,
  lat: number,
  line1: string,
  line2: string,
  lng: number,
  name: string,
  pano_id: string,
  partial_match: boolean,
  residence: string,
  state: string,
  zip: string,
  zpp: string,
  paymentTypesAccepted: ?LotPaymentTypesAccepted,
};
