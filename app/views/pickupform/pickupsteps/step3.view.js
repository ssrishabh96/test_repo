export default {
  vehicleDetails: [
    {
      id: 0,
      field: 'documentsCollected',
      section: 'Documents Collected',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Documents Collected?',
      type: 'buttons',
      optionKeys: 'Yes|No',
      key1: 'documentsCollected',
    },
    {
      id: 1,
      field: 'puTitle',
      section: 'Documents Collected',
      required: ['==', { type: 'var', value: ['0'] }, { type: 'string', value: 'Yes' }],
      editable: true,
      readable: ['==', { type: 'var', value: ['0'] }, { type: 'string', value: 'Yes' }],
      showWarning: false,
      label: 'Pickup Title',
      type: 'buttons',
      optionKeys: 'Yes|No',
      key1: 'puTitle',
    },
    {
      id: 2,
      field: 'lienRelease',
      section: 'Documents Collected',
      required: ['==', { type: 'var', value: ['0'] }, { type: 'string', value: 'Yes' }],
      editable: true,
      readable: ['==', { type: 'var', value: ['0'] }, { type: 'string', value: 'Yes' }],
      showWarning: false,
      label: 'Get Lien Release',
      type: 'buttons',
      optionKeys: 'Yes|No',
      key1: 'lienRelease',
    },
    {
      id: 3,
      field: 'poa',
      section: 'Documents Collected',
      required: ['==', { type: 'var', value: ['0'] }, { type: 'string', value: 'Yes' }],
      editable: true,
      readable: ['==', { type: 'var', value: ['0'] }, { type: 'string', value: 'Yes' }],
      showWarning: false,
      label: 'Get P.O.A',
      type: 'buttons',
      optionKeys: 'Yes|No',
      key1: 'poa',
    },
    {
      id: 4,
      field: 'otherDocuments',
      section: 'Documents Collected',
      required: false,
      editable: true,
      readable: ['==', { type: 'var', value: ['0'] }, { type: 'string', value: 'Yes' }],
      showWarning: false,
      label: 'Other',
      type: 'text',
      autoCapitalize: 'sentences',
      key1: 'otherDocuments',
      validations: {
        maxLength: 20,
      },
    },
    {
      id: 5,
      field: 'vehicleDescCorrection',
      section: 'Vehicle Details',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Vehicle Description Correction',
      type: 'text',
      autoCapitalize: 'sentences',
      key1: 'vehicleDescCorrection',
      validations: {
        maxLength: 30,
      },
    },
    {
      id: 6,
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
      id: 7,
      field: 'keys ?',
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
      id: 8,
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
      id: 9,
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
      id: 10,
      field: 'primaryDamage',
      section: 'Vehicle Details',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Primary Damage',
      type: 'accessory',
      sortable: true,
      multiselect: false,
      key1: 'primaryDamage',
      referenceDataKey: 'damageCodes',
    },
    {
      id: 11,
      field: 'secondaryDamage',
      section: 'Vehicle Details',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Secondary Damage',
      type: 'accessory',
      sortable: true,
      multiselect: false,
      key1: 'secondaryDamage',
      referenceDataKey: 'damageCodes',
    },
    {
      id: 12,
      field: 'numberOfPlates',
      section: 'Vehicle Details',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Number of Plates',
      type: 'accessory',
      sortable: false,
      multiselect: false,
      key1: 'numberOfPlates',
      referenceDataKey: 'numberOfPlates',
    },
    {
      id: 13,
      field: 'licensePlate',
      section: 'Vehicle Details',
      required: [
        'and',
        ['!=', { type: 'var', value: ['12'] }, { type: 'string', value: '' }],
        [
          'and',
          ['!=', { type: 'var', value: ['12'] }, { type: 'string', value: '0' }],
          ['!=', { type: 'var', value: ['12'] }, { type: 'string', value: 'N/A' }],
        ],
      ],
      editable: true,
      readable: [
        'and',
        ['!=', { type: 'var', value: ['12'] }, { type: 'string', value: '' }],
        [
          'and',
          ['!=', { type: 'var', value: ['12'] }, { type: 'string', value: '0' }],
          ['!=', { type: 'var', value: ['12'] }, { type: 'string', value: 'N/A' }],
        ],
      ],
      showWarning: false,
      label: 'License Plate',
      type: 'text',
      autoCapitalize: 'characters',
      key1: 'licensePlate',
      validations: {
        maxLength: 10,
      },
    },
    {
      id: 14,
      field: 'state',
      section: 'Vehicle Details',
      required: [
        'and',
        ['!=', { type: 'var', value: ['12'] }, { type: 'string', value: '' }],
        [
          'and',
          ['!=', { type: 'var', value: ['12'] }, { type: 'string', value: '0' }],
          ['!=', { type: 'var', value: ['12'] }, { type: 'string', value: 'N/A' }],
        ],
      ],
      editable: true,
      readable: [
        'and',
        ['!=', { type: 'var', value: ['12'] }, { type: 'string', value: '' }],
        [
          'and',
          ['!=', { type: 'var', value: ['12'] }, { type: 'string', value: '0' }],
          ['!=', { type: 'var', value: ['12'] }, { type: 'string', value: 'N/A' }],
        ],
      ],
      showWarning: false,
      label: 'State',
      type: 'accessory',
      sortable: true,
      multiselect: false,
      key1: 'state',
      referenceDataKey: 'stateCodes',
    },
    {
      id: 15,
      field: 'vinPlate',
      section: 'Vehicle Details',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'VIN Plate ?',
      type: 'buttons',
      optionKeys: 'Yes|No',
      key1: 'vinPlate',
    },
    {
      id: 16,
      field: 'shopVIN',
      section: 'Vehicle Details',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Shop VIN',
      type: 'vin',
      key1: 'shopVIN',
      validations: {
        maxLength: 17,
      },
    },
    {
      id: 17,
      field: 'mechanical',
      section: 'Vehicle Missing Parts',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Mechanical',
      type: 'accessory',
      sortable: false,
      multiselect: true,
      key1: 'mechanical',
      referenceDataKey: 'mechanicalPartCodes',
    },
    {
      id: 18,
      field: 'interior',
      section: 'Vehicle Missing Parts',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Interior',
      type: 'accessory',
      sortable: false,
      multiselect: true,
      key1: 'interior',
      referenceDataKey: 'interiorPartCodes',
    },
    {
      id: 19,
      field: 'sheetMetal',
      section: 'Vehicle Missing Parts',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Sheet Metal',
      type: 'accessory',
      sortable: false,
      multiselect: true,
      key1: 'sheetMetal',
      referenceDataKey: 'sheetMetalPartCodes',
    },
    {
      id: 20,
      field: 'exterior',
      section: 'Vehicle Missing Parts',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Exterior',
      type: 'accessory',
      sortable: false,
      multiselect: true,
      key1: 'exterior',
      referenceDataKey: 'exteriorPartCodes',
    },
    {
      id: 21,
      field: 'driverSideAir',
      section: 'Airbag Details',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Driver Side Airbag',
      type: 'buttons',
      optionKeys: 'Damaged|Missing',
      key1: 'driverSideAir',
    },
    {
      id: 22,
      field: 'passSideAir',
      section: 'Airbag Details',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Passenger Side Airbag',
      type: 'buttons',
      optionKeys: 'Damaged|Missing',
      key1: 'passSideAir',
    },
    {
      id: 23,
      field: 'leftSideAir',
      section: 'Airbag Details',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Left Side Airbag',
      type: 'buttons',
      optionKeys: 'Damaged|Missing',
      key1: 'leftSideAir',
    },
    {
      id: 24,
      field: 'rightSideAir',
      section: 'Airbag Details',
      required: false,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Right Side Airbag',
      type: 'buttons',
      optionKeys: 'Damaged|Missing',
      key1: 'rightSideAir',
    },
    {
      id: 25,
      field: 'numberOfWheels',
      section: 'Wheel Details',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Number of Wheels',
      type: 'accessory',
      sortable: false,
      multiselect: false,
      key1: 'numberOfWheels',
      referenceDataKey: 'numberOfWheels',
    },
    {
      id: 26,
      field: 'wheelType',
      section: 'Wheel Details',
      required: [
        'and',
        ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: '' }],
        [
          'and',
          ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: '0' }],
          ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: 'N/A' }],
        ],
      ],
      editable: true,
      readable: [
        'and',
        ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: '' }],
        [
          'and',
          ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: '0' }],
          ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: 'N/A' }],
        ],
      ],
      showWarning: false,
      label: 'Wheel Type',
      type: 'buttons',
      optionKeys: 'Alloy|Steel',
      key1: 'wheelType',
    },
    {
      id: 27,
      field: 'wheelModel',
      section: 'Wheel Details',
      required: [
        'and',
        ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: '' }],
        [
          'and',
          ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: '0' }],
          ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: 'N/A' }],
        ],
      ],
      editable: true,
      readable: [
        'and',
        ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: '' }],
        [
          'and',
          ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: '0' }],
          ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: 'N/A' }],
        ],
      ],
      showWarning: false,
      label: 'Wheel Model',
      type: 'buttons',
      optionKeys: 'Standard|Custom',
      key1: 'wheelModel',
    },
    {
      id: 28,
      field: 'evidenceOfTeardown',
      section: 'Wheel Details',
      required: [
        'and',
        ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: '' }],
        [
          'and',
          ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: '0' }],
          ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: 'N/A' }],
        ],
      ],
      editable: true,
      readable: [
        'and',
        ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: '' }],
        [
          'and',
          ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: '0' }],
          ['!=', { type: 'var', value: ['25'] }, { type: 'string', value: 'N/A' }],
        ],
      ],
      showWarning: false,
      label: 'Evidence of Teardown',
      type: 'buttons',
      optionKeys: 'Yes|No',
      key1: 'evidenceOfTeardown',
    },
    {
      id: 29,
      field: 'vehicleImages',
      section: 'Vehicle Image',
      required: true,
      editable: true,
      readable: true,
      showWarning: false,
      label: 'Vehicle Image',
      type: 'image',
      key1: 'vehicleImages',
      documentType: 'DISPATCH_IMAGE',
    },
  ],
};
