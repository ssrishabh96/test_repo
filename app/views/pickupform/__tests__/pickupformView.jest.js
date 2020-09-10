import React from 'react';
import { shallow } from 'enzyme';
import { PickupFormContainer, convertData } from '../pickupform.view';
import referenceCodes from 'utils/mappers/referenceCodes';
import StepOne from '../pickupsteps/step1.view';

import ImagePicker from 'react-native-image-picker';

const initialMockLot = {
  dispatch_assignment_detail_id: 42,
  tripType: 'P',
  formType: 'P',
  source: { line_1: 123, city: 'plano', state: 'TX', zip: 75075 },
  destination: { line_1: null, city: null, state: null, zip: null },
  description: 'Blue Honda',
  vehicleImages: undefined,
};
const formReadyLot = {
  dispatch_assignment_detail_id: 42,
  tripType: 'P',
  formType: 'P',
  source: { line_1: 123, city: 'plano', state: 'TX', zip: 75075 },
  destination: { line_1: null, city: null, state: null, zip: null },
  description: 'Blue Honda',
  vehicleDescCorrection: 'Blue Honda',
  yardAddress: '',
  pickUpAddress: '123 plano TX 75075',
};

const DefaultProps = {
  lot: initialMockLot,
  currentStep: 0,
  tripType: 'P',
  currentPickupLot: formReadyLot,
  dataSource: convertData(StepOne),
  referenceCodes,
  showImagePreview: false,
  imagePreview: {},
  isSubmitting: false,
  submittingStatus: '',
  navigator: {
    setOnNavigatorEvent: jest.fn(),
    setButtons: jest.fn(),
    dismissModal: jest.fn(),
    push: jest.fn(),
    showModal: jest.fn(),
    showInAppNotification: jest.fn(),
  },
  incrementCurrentStep: jest.fn(),
  decrementCurrentStep: jest.fn(),
  setCurrentPickupLot: jest.fn(),
  updateWarningFlags: jest.fn(),
  goBackFromLotView: jest.fn(),
  resetCurrentStep: jest.fn(),
  updatePickupLotData: jest.fn(),
  showHideImagePreview: jest.fn(),
  uploadPickupForm: jest.fn(),
  cacheCurrentForm: jest.fn(),
};

test('Form View Renders', () => {
  const wrapper = shallow(<PickupFormContainer {...DefaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
test('loading renders', () => {
  const customProps = {
    currentPickupLot: {},
  };
  const wrapper = shallow(<PickupFormContainer
    {...DefaultProps}
    {...customProps}
  />);
  expect(wrapper).toMatchSnapshot();
});
test('submitting renders', () => {
  const customProps = {
    isSubmitting: true,
    submittingStatus: 'test submitting status',
  };
  const wrapper = shallow(<PickupFormContainer
    {...DefaultProps}
    {...customProps}
  />);
  expect(wrapper).toMatchSnapshot();
});

describe('when the camera is opened and a picture is taken.', () => {
  let wrapper;
  const key1 = 'checkImage';
  const handleOnSelect = jest.fn();
  const documentType = 'ADVANCE_CARGES_REVIEW';
  ImagePicker.launchCamera.mockImplementation((options, cb) =>
    cb({ didCancel: false, uri: 'root/path/to/filename1.png' }),
  );
  beforeEach(() => {
    wrapper = shallow(<PickupFormContainer {...DefaultProps} />);
    handleOnSelect.mockReset();
  });
  describe('for a multiImageItem', () => {
    const type = 'multiImage';
    test('if the passed value is undefined, it sets the new image into value', (done) => {
      const value = undefined;
      const replaceItem = undefined;
      const newValue = [
        {
          key: 0,
          documentType,
          key1,
          type,
          image: { encoded: '', pathName: 'root/path/to/filename1.png' },
        },
      ];
      wrapper.instance().openCamera(key1, value, handleOnSelect, type, documentType, replaceItem);
      setTimeout(() => {
        expect(handleOnSelect.mock.calls).toEqual([[key1, newValue]]);
        done();
      }, 1000);
    });
    test('if the passed value is [], it sets the new image into value', (done) => {
      const value = [];
      const replaceItem = undefined;
      const newValue = [
        {
          key: 0,
          documentType,
          key1,
          type,
          image: { encoded: '', pathName: 'root/path/to/filename1.png' },
        },
      ];

      wrapper.instance().openCamera(key1, value, handleOnSelect, type, documentType, replaceItem);
      setTimeout(() => {
        expect(handleOnSelect.mock.calls).toEqual([[key1, newValue]]);
        done();
      }, 1000);
    });
    test('if the passed value has an image already, it pushes the image onto the end of the value', (done) => {
      const value = [
        {
          key: 0,
          documentType,
          key1,
          type,
          image: { encoded: '', pathName: 'root/path/to/original.png' },
        },
      ];
      const replaceItem = undefined;
      const newValue = [
        {
          key: 0,
          documentType,
          key1,
          type,
          image: { encoded: '', pathName: 'root/path/to/original.png' },
        },
        {
          key: 1,
          documentType,
          key1,
          type,
          image: { encoded: '', pathName: 'root/path/to/filename1.png' },
        },
      ];

      wrapper.instance().openCamera(key1, value, handleOnSelect, type, documentType, replaceItem);
      setTimeout(() => {
        expect(handleOnSelect.mock.calls).toEqual([[key1, newValue]]);
        done();
      }, 1000);
    });
    test('if the passed value has images already, and replaceItem is passed, it replaces that image in value with the new image', (done) => {
      const value = [
        {
          key: 0,
          documentType,
          key1,
          type,
          image: { encoded: '', pathName: 'root/path/to/photo1.png' },
        },
        {
          key: 1,
          documentType,
          key1,
          type,
          image: { encoded: '', pathName: 'root/path/to/photo2.png' },
        },
        {
          key: 2,
          documentType,
          key1,
          type,
          image: { encoded: '', pathName: 'root/path/to/photo3.png' },
        },
      ];
      const replaceItem = value[1];
      const newValue = [
        {
          key: 0,
          documentType,
          key1,
          type,
          image: { encoded: '', pathName: 'root/path/to/photo1.png' },
        },
        {
          key: 1,
          documentType,
          key1,
          type,
          image: { encoded: '', pathName: 'root/path/to/filename1.png' },
        },
        {
          key: 2,
          documentType,
          key1,
          type,
          image: { encoded: '', pathName: 'root/path/to/photo3.png' },
        },
      ];

      wrapper.instance().openCamera(key1, value, handleOnSelect, type, documentType, replaceItem);
      setTimeout(() => {
        expect(handleOnSelect.mock.calls).toEqual([[key1, newValue]]);
        done();
      }, 1000);
    });
  });
  describe('for a singular image item', () => {
    const type = 'image';
    test('if the passed value is undefined, it sets the new image into value', (done) => {
      const value = undefined;
      const replaceItem = undefined;
      const newValue = {
        key: 0,
        documentType,
        key1,
        type,
        encoded: '',
        pathName: 'root/path/to/filename1.png',
      };
      wrapper.instance().openCamera(key1, value, handleOnSelect, type, documentType, replaceItem);
      setTimeout(() => {
        expect(handleOnSelect.mock.calls).toEqual([[key1, newValue]]);
        done();
      }, 1000);
    });
    test('if the passed value already has an image, it replaces it', (done) => {
      const value = {
        key: 0,
        documentType,
        key1,
        type,
        encoded: '',
        pathName: 'root/path/to/original.png',
      };
      const replaceItem = undefined;
      const newValue = {
        key: 0,
        documentType,
        key1,
        type,
        encoded: '',
        pathName: 'root/path/to/filename1.png',
      };
      wrapper.instance().openCamera(key1, value, handleOnSelect, type, documentType, replaceItem);
      setTimeout(() => {
        expect(handleOnSelect.mock.calls).toEqual([[key1, newValue]]);
        done();
      }, 1000);
    });
  });
});
