import tblePickupInfo from './tblpickupinfo';

const pickupData = {
  insertProcessPickupData(data) {
    tblePickupInfo.write(() => {
      tblePickupInfo.create(
        'PickupInfo',
        {
          lotNumber: data.number,
          lotTripId: data.lotTripId,
          make: data.make,
          model: data.model,
          selectedByUser: data.selectedByUser,
          sellerNumber: data.sellerNumber,
          yardNumber: data.yardNumber,
          puTitle: data.puTitle,
          lienRelease: data.lienRelease,
          poa: data.poa,
          otherDocuments: data.otherDocuments,
          vehicleDescCorrection: data.vehicleDescCorrection,
          towType: data.towType,
          keys: data.keys,
          keyFob: data.keyFob,
          colors: data.colors,
          primaryDamage: data.primaryDamage,
          licensePlate: data.licensePlate,
          state: data.state,
          numberOfPlates: data.numberOfPlates,
          vinPlate: data.vinPlate,
          shopVIN: data.shopVIN,
          mechanical: data.mechanical,
          exterior: data.exterior,
          interior: data.interior,
          sheetMetal: data.sheetMetal,
          driverSideAir: data.driverSideAir,
          passSideAir: data.passSideAir,
          leftSideAir: data.leftSideAir,
          rightSideAir: data.rightSideAir,
          numberOfWheels: data.numberOfWheels,
          wheelType: data.wheelType,
          wheelModel: data.wheelModel,
          evidenceOfTeardown: data.evidenceOfTeardown,
          labourCost: data.labourCost,
          yardCost: data.yardCost,
          storageFrom: data.storageFrom,
          storageTo: data.storageTo,
          flatStorageCost: data.flatStorageCost,
          miscellenousCost: data.miscellenousCost,
          tax: data.tax,
          paymentType: data.paymentType,
          driverPrint: data.driverPrint,
          ownerPrint: data.ownerPrint,
          datePickedUp: data.datePickedUp,
          notes: data.notes,
          uploadAttachment: data.uploadAttachment || [],
          attachment: data.attachment || [],
          creditCardImage: data.creditCardImage,
          checkImage: data.checkImage,
          vehicleImages: data.vehicleImages,
          driverSignature: data.driverSignature,
          ownerSignature: data.ownerSignature,
        },
        true,
      );
    });
  },
  getPickupProcessData() {
    return tblePickupInfo.objects('PickupInfo');
  },
};

export default pickupData;
