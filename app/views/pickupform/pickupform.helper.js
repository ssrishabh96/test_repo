import { compose, prop, find, propEq, reduce, assoc } from 'ramda';
import { getLotTripFormByType } from 'constants/tripTypeMap';
import referenceCodes from 'utils/mappers/referenceCodes';

const {
  mechanicalPartCodes,
  exteriorPartCodes,
  interiorPartCodes,
  sheetMetalPartCodes,
} = referenceCodes;

export function mapMultiCodes(codes, selected) {
  const list = reduce((acc, next) => assoc(next.code, false)(acc))({})(codes);
  const final = reduce((acc, next) => assoc(next, true)(acc))(list)(
    selected ? selected.split('|') : [],
  );
  return final;
}
function mapPaymentOptions(chargesCollected, type, lot) {
  if (chargesCollected === 'No') {
    return {};
  }
  switch (type) {
    case 'Cash':
      return {
        payment_type: type,
        total: lot.cashTotal,
      };
    case 'Credit Card':
      return {
        payment_type: type,
        credit_card_number: lot.creditCardNumber,
        name_on_card: lot.creditCardName,
        total: lot.creditCardTotal,
        date_paid: lot.creditCardDate,
        credit_card_image: 1, // ?... what is expected value...? already uploaded images
      };
    case 'Check':
      return {
        payment_type: type,
        check_number: lot.checkNumber,
        routing_number: lot.checkRoutingNumber,
        account_number: lot.checkAccountNumber,
        total: lot.checkTotal,
        check_image: 1, // ?... what is expected value...? already uploaded images
      };
    default:
      return {};
  }
}

export const buildMultiImage = images =>
  images.map((x) => {
    const obj = {};
    const path = x.image.pathName.replace('file://', '');
    const fileName = path
      .split('\\')
      .pop()
      .split('/')
      .pop();
    obj.documentType = x.documentType;
    obj.filepath = path;
    obj.filename = fileName;
    obj.type = x.type;
    obj.value = images;
    return obj;
  });

export const buildImage = (image) => {
  const path = image.pathName.replace('file://', '');
  const filename = path
    .split('\\')
    .pop()
    .split('/')
    .pop();
  return {
    documentType: image.documentType,
    filepath: path,
    filename,
    type: image.type,
    value: image,
  };
};

export const getDescriptionFromCode = (referenceData, code) => {
  if (!code) return '';
  return compose(prop('description'), find(propEq('code', code)))(referenceData);
};
const towTypeMap = { S: 'Standard', M: 'Medium', H: 'Heavy' };
const emptyIf = condition => (condition ? () => '' : x => x || '');

export const prepareFormData = (lot) => {
  // needs work
  let sendData = '';
  const lotTripTypeInfo = getLotTripFormByType(lot);
  if (lotTripTypeInfo.formType === 'pickup') {
    const emptyIfNoPlates = emptyIf(['N/A', '0', ''].includes(lot.numberOfPlates));
    const emptyIfNoWheels = emptyIf(['N/A', '0', ''].includes(lot.numberOfWheels));
    const emptyIfOwnerRefused = emptyIf(lot.otherRefusedSign === 'Yes');
    sendData = {
      vehicle_details: {
        description_correction: lot.vehicleDescCorrection,
        has_keys: lot.keys,
        keys_fob: lot.keyFob,
        vehicle_color: getDescriptionFromCode(referenceCodes.colors, lot.colors), // code => description
        has_vin_plate: lot.vinPlate,
        primary_damage: getDescriptionFromCode(referenceCodes.damageCodes, lot.primaryDamage), // code => description
        secondary_damage: getDescriptionFromCode(referenceCodes.damageCodes, lot.secondaryDamage), // code => description
        number_of_plates: lot.numberOfPlates,
        license_plate: emptyIfNoPlates(lot.licensePlate) || '',
        state: emptyIfNoPlates(lot.state),
        tow_type: towTypeMap[lot.towType], // S|M|H => Standard|Medium|Heavy
        shop_vin: lot.shopVIN ? lot.shopVIN : '',
      },
      documents_collected: {
        pickup_title: lot.documentsCollected === 'Yes' ? lot.puTitle : 'No',
        get_lien_release: lot.documentsCollected === 'Yes' ? lot.lienRelease : 'No',
        get_poa: lot.documentsCollected === 'Yes' ? lot.poa : 'No',
        other: lot.otherDocuments ? lot.otherDocuments : '',
      },
      acknowledgements: {
        driver_name: lot.driverPrint,
        owner_name: lot.ownerPrint,
        date_picked_up: lot.datePickedUp,
        notes: lot.notes,
        other_refused_to_sign: lot.otherRefusedSign,
      },
      wheel_details: {
        number_of_wheels: lot.numberOfWheels,
        type: emptyIfNoWheels(lot.wheelType),
        model: emptyIfNoWheels(lot.wheelModel),
        evidence_of_teardown: emptyIfNoWheels(lot.evidenceOfTeardown),
      },
      missing_parts: {
        mechanical: mapMultiCodes(mechanicalPartCodes, lot.mechanical),
        exterior: mapMultiCodes(exteriorPartCodes, lot.exterior),
        interior: mapMultiCodes(interiorPartCodes, lot.interior),
        sheet_metal: mapMultiCodes(sheetMetalPartCodes, lot.sheetMetal),
      },
      airbag: {
        driver: lot.driverSideAir,
        passenger: lot.passSideAir,
        left: lot.leftSideAir,
        right: lot.rightSideAir,
      },
      advanced_charges: {
        tow: lot.tow || '',
        labor: lot.labor || '',
        gate: lot.gate || '',
        storage_from_date: lot.storage_from_date || '',
        storage_to_date: lot.storage_to_date || '',
        storage_rate: lot.storage_rate || '',
        storage_amount: lot.storage_amount || '',
        second_storage_from_date: lot.second_storage_from_date || '',
        second_storage_to_date: lot.second_storage_to_date || '',
        second_storage_rate: lot.second_storage_rate || '',
        second_storage_amount: lot.second_storage_amount || '',
        negotiated_storage: lot.negotiated_storage || '',
        estimating_fee: lot.estimating_fee || '',
        misc: lot.misc || '',
        tax: lot.tax || '',
        total: lot.total || '',
      },
      payment_options: {
        has_charges: lot.hasCharges || '',
        ...mapPaymentOptions(lot.hasCharges, lot.paymentType, lot),
      },
      driver_signature: lot.driverSignature.encoded,
      other_signature: emptyIfOwnerRefused(lot.ownerSignature && lot.ownerSignature.encoded),
    };
  } else {
    // consider everythings else as delivery
    sendData = {
      vehicle_details: {
        description_correction: lot.vehicleDescCorrection,
        has_keys: lot.keys,
        keys_fob: lot.keyFob,
        vehicle_color: lot.colors,
        cat_conv: lot.catConv,
        has_vin_plate: lot.vinPlate,
        driver_vin: lot.driverVin,
        notes: lot.deliveryNotes,
        tow_type: lot.towType,
      },
      acknowledgements: {
        driver_name: lot.driverPrint,
        transport_date: lot.transportDate,
        accepted_by: lot.acceptedBy,
        print_name: lot.acceptedPrint,
        // upload_document: 1, // ?... what is expected value...? already uploaded images
      },
      driver_signature: lot.driverSignature.encoded,
      other_signature: !!lot.acceptedSignature && lot.acceptedSignature.encoded,
    };
  }
  // console.log('form submission data', sendData);
  return sendData;
};
