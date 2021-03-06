export default {
  vehicleDetails: [
    {
      id: 1,
      field: 'vehicleDescCorrection',
      section: 'Vehicle Details',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Vehicle Desc Correction',
      type: 'text',
      key1: 'vehicleDescCorrection',
      validations: {
        maxLength: 30,
      },
    },
    {
      id: 2,
      field: 'keys',
      section: 'Vehicle Details',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Keys ?',
      type: 'buttons',
      optionKeys: 'Yes|No',
      key1: 'keys',
    },
    {
      id: 15,
      field: 'keyFob',
      section: 'Vehicle Details',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Keys Fob ?',
      type: 'buttons',
      optionKeys: 'Yes|No',
      key1: 'keyFob',
    },
    {
      id: 3,
      field: 'vehicleColor',
      section: 'Vehicle Details',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Vehicle Color',
      type: 'accessory',
      sortable: true,
      multiselect: false,
      key1: 'colors',
      referenceDataKey: 'colors',
    },
    {
      id: 4,
      field: 'catConv',
      section: 'Vehicle Details',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'CAT Conv',
      type: 'buttons',
      optionKeys: 'Yes|No',
      key1: 'catConv',
    },
    {
      id: 18,
      field: 'towType',
      section: 'Vehicle Details',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Tow Type ?',
      type: 'buttons',
      optionKeys: 'Standard|Medium|Heavy',
      optionValues: 'S|M|H',
      key1: 'towType',
    },
    {
      id: 5,
      field: 'vinPlate',
      section: 'Vehicle Details',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'VIN Plate?',
      type: 'buttons',
      optionKeys: 'Yes|No',
      key1: 'vinPlate',
    },
    {
      id: 6,
      field: 'driverVin',
      section: 'Vehicle Details',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Driver VIN',
      type: 'vin',
      key1: 'driverVin',
    },
    {
      id: 7,
      field: 'deliveryNotes',
      section: 'Vehicle Details',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Notes',
      type: 'comments',
      validations: {
        maxLength: 100,
      },
      key1: 'deliveryNotes',
    },
  ],
};
