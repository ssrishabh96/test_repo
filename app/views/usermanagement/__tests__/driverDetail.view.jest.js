import React from 'react';
import renderer from 'react-test-renderer';
import { DriverDetail } from '../driverdetail.view';

test('it matches the snapshot', () => {
  const defaultProps = {
    driverIsLoading: false,
    driverId: 123,
    driverData: [
      {
        vendorPersonnelId: 123,
      },
    ],
    driver: {},
    currentDriver: {},
    navigator: { showInAppNotification: jest.fn(), pop: jest.fn(), setTitle: jest.fn() },
    updateDriverStatus: jest.fn(),
    updateDriverDispatchableFlag: jest.fn(),
    setCurrentDriver: jest.fn(),
    pcardAction: jest.fn(),
  };
  const tree = renderer.create(<DriverDetail {...defaultProps} />).toJSON();
  expect(tree).toMatchSnapshot();
});
