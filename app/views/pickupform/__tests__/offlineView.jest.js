import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import { PickupFormContainer, convertData } from '../pickupform.view';
import referenceCodes from 'utils/mappers/referenceCodes';
import StepThree from '../pickupsteps/step3.view';

const Lot1 = {
  number: 1234567,
  dispatch_assignment_detail_id: 42,
  tripType: 'P',
  formType: 'P',
  source: { line_1: 123, city: 'plano', state: 'TX', zip: 75075 },
  destination: { line_1: null, city: null, state: null, zip: null },
  description: 'Blue Honda',
  vehicleImages: undefined,
  lotStatus: 260,
  vehicleType: 'V - vehicle',
  hasIssue: false,
};
const formReadyLot1 = {
  dispatch_assignment_detail_id: 42,
  tripType: 'P',
  formType: 'P',
  source: { line_1: 123, city: 'plano', state: 'TX', zip: 75075 },
  destination: { line_1: null, city: null, state: null, zip: null },
  description: 'Blue Honda',
  vehicleDescCorrection: 'Blue Honda',
  yardAddress: '',
  pickUpAddress: '123 plano TX 75075',
  lotStatus: 260,
  vehicleType: 'V - vehicle',
  hasIssue: false,
  driverSignature: 'base64encoded string',
  driverPrint: 'name',
  ownerSignature: 'base64encoded string',
  ownerPrint: 'name',
  datePickedUp: '1/11/1111',
  notes: 'notes',
  uploadAttachment: 'path to image',
};
const defaultProps = {
  lot: Lot1,
  currentStep: 0,
  tripType: 'P',
  currentPickupLot: formReadyLot1,
  dataSource: convertData(StepThree),
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
    handleDeepLink: jest.fn(),
  },
  incrementCurrentStep: jest.fn(),
  decrementCurrentStep: jest.fn(),
  setCurrentPickupLot: jest.fn(),
  updateWarningFlags: jest.fn(),
  goBackFromLotView: jest.fn(),
  resetCurrentStep: jest.fn(),
  updatePickupLotData: jest.fn(),
  showHideImagePreview: jest.fn(),
  uploadPickupForm: jest.fn(() => Promise.resolve()),
  cacheCurrentForm: jest.fn(),
  setFormAwaittingSync: jest.fn(),
  connectionStatus: false,
};

describe('when you are offline', () => {
  let wrapper;
  // let rendered;
  // let renderedRoot;
  beforeEach(() => {
    Object.keys(defaultProps).forEach((key) => {
      if (defaultProps[key].mockClear) defaultProps[key].mockClear();
    });
    Object.keys(defaultProps.navigator).forEach((key) => {
      if (defaultProps.navigator[key].mockClear) defaultProps.navigator[key].mockClear();
    });
    wrapper = shallow(<PickupFormContainer
      {...defaultProps}
      connectionStatus={false}
    />);
    wrapper.instance().sectionlist = {
      scrollToLocation: jest.fn(),
    };
    // rendered = renderer.create(<PickupFormContainer
    //   {...defaultProps}
    //   connectionStatus={false}
    // />);
    // renderedRoot = rendered.root;
  });
  test('should show offline banner?');
  test('lotNotes button is available', () => {
    expect(wrapper.find('LotNotesButton').length).toBe(1);
  });
  describe('and you submit a form', () => {
    test('cacheCurrentForm is called', () => {
      wrapper.setProps({ currentStep: 2 });
      wrapper.instance().onNext();
      expect(defaultProps.cacheCurrentForm.mock.calls).toEqual([[formReadyLot1, true]]);
    });
    test.skip('awaiting sync notification appears', (done) => {
      // its showing in calls twice. gotta look into this...
      wrapper.setProps({ currentStep: 2 });
      wrapper.instance().onNext();
      expect.assertions(1);
      setTimeout(() => {
        expect(defaultProps.navigator.showInAppNotification.mock.calls).toEqual([
          {
            screen: 'CopartTransporter.ShowInAppNotification',
            passProps: {
              type: 'success',
              content: 'Form saved in queue, awaiting sync.',
            },
          },
        ]);
        done();
      }, 600);
    });
    test('you are taken back to inProgress view', () => {
      wrapper.setProps({ currentStep: 2 });
      wrapper.instance().onNext();
      expect(defaultProps.navigator.handleDeepLink.mock.calls).toEqual([
        [{ link: 'popTo/lotList' }],
      ]);
    });
  });
});
describe('when you are online', () => {
  let wrapper;
  beforeEach(() => {
    Object.keys(defaultProps).forEach((key) => {
      if (defaultProps[key].mockClear) defaultProps[key].mockClear();
    });
    Object.keys(defaultProps.navigator).forEach((key) => {
      if (defaultProps.navigator[key].mockClear) defaultProps.navigator[key].mockClear();
    });
    wrapper = shallow(<PickupFormContainer
      {...defaultProps}
      connectionStatus
    />);
    wrapper.instance().sectionlist = {
      scrollToLocation: jest.fn(),
    };
  });
  test('the lotNotes button is available', () => {
    expect(wrapper.find('LotNotesButton').length).toBe(1);
  });
  describe('and you submit a form', () => {
    test('it should call uploadPickupForm', () => {
      wrapper.setProps({ currentStep: 2 });
      wrapper.instance().onNext();
      expect(defaultProps.uploadPickupForm.mock.calls.length).toBe(1);
    });
    test('you are taken back to inProgress view', (done) => {
      wrapper.setProps({ currentStep: 2 });
      wrapper.instance().onNext();
      expect.assertions(1);
      setTimeout(() => {
        expect(defaultProps.navigator.handleDeepLink.mock.calls).toEqual([
          [
            {
              link: 'popTo/lotList',
            },
          ],
        ]);
        done();
      }, 200);
    });
  });
});
