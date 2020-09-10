import Realm from 'realm';

class PickupInfo extends Realm.Object {}
PickupInfo.schema = {
  name: 'PickupInfo',
  primaryKey: 'lotNumber',
  properties: {
    lotNumber: 'int',
    lotTripId: { type: 'int', optional: true },
    make: { type: 'string', optional: true },
    model: { type: 'string', optional: true },
    selectedByUser: { type: 'string', optional: true },
    sellerNumber: { type: 'string', optional: true },
    yardNumber: 'int',
    puTitle: 'string',
    lienRelease: 'string',
    poa: 'string',
    otherDocuments: { type: 'string', optional: true },
    vehicleDescCorrection: { type: 'string', optional: true },
    towType: 'string',
    keys: 'string',
    keyFob: 'string',
    colors: 'string',
    primaryDamage: 'string',
    licensePlate: { type: 'string', optional: true },
    state: { type: 'string', optional: true },
    numberOfPlates: 'string',
    vinPlate: 'string',
    shopVIN: { type: 'string', optional: true },
    mechanical: { type: 'string', optional: true },
    exterior: { type: 'string', optional: true },
    interior: { type: 'string', optional: true },
    sheetMetal: { type: 'string', optional: true },
    driverSideAir: { type: 'string', optional: true },
    passSideAir: { type: 'string', optional: true },
    leftSideAir: { type: 'string', optional: true },
    rightSideAir: { type: 'string', optional: true },
    numberOfWheels: 'string',
    wheelType: { type: 'string', optional: true },
    wheelModel: { type: 'string', optional: true },
    evidenceOfTeardown: { type: 'string', optional: true },
    labourCost: 'string',
    yardCost: 'string',
    storageFrom: 'string',
    storageTo: 'string',
    flatStorageCost: 'string',
    miscellenousCost: { type: 'string', optional: true },
    tax: { type: 'string', optional: true },
    paymentType: 'string',
    driverPrint: 'string',
    ownerPrint: 'string',
    datePickedUp: 'string',
    notes: { type: 'string', optional: true },
    documentImages: { type: 'list', objectType: 'MultiImage' },
    uploadAttachment: { type: 'list', objectType: 'MultiImage' },
    attachment: { type: 'list', objectType: 'MultiImage' },
    creditCardImage: 'SingleImage',
    checkImage: 'SingleImage',
    vehicleImages: 'SingleImage',
    driverSignature: 'SignatureInfo',
    ownerSignature: 'SignatureInfo',
  },
};
class SignatureInfo extends Realm.Object {}
SignatureInfo.schema = {
  name: 'SignatureInfo',
  properties: {
    key: { type: 'int', optional: true },
    encoded: { type: 'string', optional: true },
    pathName: { type: 'string', optional: true },
  },
};
class SingleImage extends Realm.Object {}
SingleImage.schema = {
  name: 'SingleImage',
  properties: {
    key: { type: 'int', optional: true },
    encoded: { type: 'string', optional: true },
    pathName: { type: 'string', optional: true },
    requestId: { type: 'string', optional: true },
    documentType: { type: 'string', optional: true },
  },
};
class MultiImage extends Realm.Object {}
MultiImage.schema = {
  name: 'MultiImage',
  properties: {
    key: 'int',
    documentType: { type: 'string', optional: true },
    image: 'ImageInfo',
  },
};
class ImageInfo extends Realm.Object {}
ImageInfo.schema = {
  name: 'ImageInfo',
  properties: {
    encoded: { type: 'string', optional: true },
    pathName: { type: 'string', optional: true },
    requestId: { type: 'string', optional: true },
  },
};

const schemas = [
  {
    schema: [PickupInfo, SignatureInfo, MultiImage, SingleImage, ImageInfo],
    path: 'tblpickupinfo.realm',
    schemaVersion: 1,
    migration: function migrationFunction1() {
      let nextSchemaIndex = Realm.schemaVersion('tblpickupinfo.realm');
      while (nextSchemaIndex < schemas.length) {
        const migratedRealm = new Realm(schemas[nextSchemaIndex++]); // eslint-disable-line
        migratedRealm.close();
      }
    },
  },
];
const realm = new Realm(schemas[schemas.length - 1]);
export default realm;
