import { props, contains, all, compose, not, isNil, when, map, prop } from 'ramda';
import Locale from 'utils/locale';
import { DELIVERY_STEPS, PICKUP_STEPS } from 'views/pickupform/pickupform.constants';

export const delivery = {
  lotViewTitle: Locale.translate('tab.InProgress.DeliveryInformation'),
  formViewTitle: 'Delivery Form',
  formSteps: DELIVERY_STEPS,
  formType: 'delivery',
  formStepCount: 2,
  advancesAndInformationHeading: 'ADVANCES AND DELIVERY INFORMATION',
  tripNotesHeading: 'Delivery Notes',
  orderButton: 'Delivery Order',
  issueButton: 'Unable to Deliver',
};
export const pickup = {
  lotViewTitle: Locale.translate('tab.InProgress.PickupInformation'),
  formViewTitle: 'Pickup Form',
  formType: 'pickup',
  formSteps: PICKUP_STEPS,
  formStepCount: 3,
  advancesAndInformationHeading: 'ADVANCES AND PICKUP INFORMATION',
  tripNotesHeading: 'Pickup Notes',
  orderButton: 'Pickup Order',
  issueButton: 'Unable to Pickup',
};

const isNotNil = compose(not, isNil);
const hasYard = when(isNotNil, contains('yard'));
const hasLoc = contains('loc');
const locations = ['destination', 'source'];
const isYardToYard = compose(all(hasYard), map(prop('id')), props(locations));
const isLocToLoc = compose(all(hasLoc), map(prop('id')), props(locations));

const typesByTripTypeCode = {
  P: pickup,
  D: delivery,
  B: delivery,
  S: delivery,
  T: delivery,
};

export const getLotTripTypeInfo = (lot) => {
  if (lot.tripType === 'T') {
    if (isYardToYard(lot)) return delivery;
    if (isLocToLoc(lot)) return pickup;
    return pickup;
  }
  return typesByTripTypeCode[lot.tripType];
};

const formTypeMap = {
  P: pickup,
  D: delivery,
  U: null,
};
export const getLotTripFormByType = lot => formTypeMap[lot.formType.toUpperCase()];

export default typesByTripTypeCode;
