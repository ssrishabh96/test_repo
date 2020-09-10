import React from 'react';
import { shallow } from 'enzyme';

import FormList from '../';
import StepOne from '../../../pickupsteps/step1.view';
import { convertData } from '../../../pickupform.view';
import referenceCodes from 'utils/mappers/referenceCodes';

const defaultLot = {
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
const defaultProps = {
  data: convertData(StepOne),
  currentPickupLot: defaultLot,
  handleOnSelect: jest.fn(),
  onRef: jest.fn(),
  openPicker: jest.fn(),
  openCamera: jest.fn(),
  handlePreviewClick: jest.fn(),
  showWarningNotification: jest.fn(),
  showSignatureView: jest.fn(),
  showScannerView: jest.fn(),
  updatePickupLotData: jest.fn(),
  referenceCodes,
};

test('it renders', () => {
  const wrapper = shallow(<FormList {...defaultProps} />);
  expect(wrapper).toMatchSnapshot();
});
