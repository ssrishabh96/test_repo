/*
 {
      id: 1,  // req for from-metadata
      field: 'vehicleDescription',  // unique key for rendering
      section: 'Vehicle Details',   // section title
      required: false,              // required flag
      editable: false,              // editable flag
      readable: true,               // readable flag
      showWarning: false,            // show warning flag
      label: 'Vehicle Description', // form label
      value: '98 ACUR CSX BLACK',   // stored/default value
      type: 'label',                // form input type
      optionKeys: 'A|B|C'           // buttons only: values
      referenceDataKey: 'descCodes' // accessory only: key for dropdown values
      sortable: true|false,         // if the list should be sorted
      key1: 'description',          // currentPickupLot key
    },
*/
export default {
  vehicleDetails: [
    {
      id: 1,
      field: 'driverSignature',
      section: 'Acknowledgements',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Driver Signature',
      type: 'signature',
      key1: 'driverSignature',
    },
    {
      id: 2,
      field: 'driverPrint',
      section: 'Acknowledgements',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Driver Print Name:',
      type: 'text',
      autoCapitalize: 'words',
      key1: 'driverPrint',
      validations: {
        maxLength: 20,
      },
    },
    {
      id: 3,
      field: 'transportDate',
      section: 'Acknowledgements',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Transport Date',
      type: 'date',
      key1: 'transportDate',
    },
    {
      id: 4,
      field: 'acceptedBy',
      section: 'Acknowledgements',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Accepted By:',
      type: 'text',
      autoCapitalize: 'words',
      key1: 'acceptedBy',
      validations: {
        maxLength: 20,
      },
    },
    {
      id: 5,
      field: 'acceptedSignature',
      section: 'Acknowledgements',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Signature',
      type: 'signature',
      key1: 'acceptedSignature',
    },
    {
      id: 6,
      field: 'acceptedPrint',
      section: 'Acknowledgements',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Print Name',
      type: 'text',
      autoCapitalize: 'words',
      key1: 'acceptedPrint',
      validations: {
        maxLength: 20,
      },
    },
    {
      id: 7,
      field: 'uploadAttachment',
      section: 'Acknowledgements',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Upload Documents',
      type: 'multiImage',
      key1: 'uploadAttachment',
      documentType: 'ADVANCE_CHARGE_RECEIPT',
    },
  ],
};
