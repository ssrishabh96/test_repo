import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import { OfflineBanner } from 'components/custom/Banner';
import { LotView } from '../lotview.view';
import * as lotViewActions from '../lotview.action';

import { PendingSync, OtherActions } from '../components/LotActionsButton/LotActionsButton';

jest.mock('components/custom/ToolTip', () => 'ToolTip');

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

const defaultProps = {
  lotNumber: Lot1.number,
  startForLot: jest.fn(),
  signoutUser: jest.fn(),
  loadAllLotInfo: jest.fn(),
  cacheLotData: jest.fn(),
  getLotCharges: jest.fn(),
  checkInLots: jest.fn(),
  clearLotInfo: jest.fn(),
  lot: Lot1,
  navigator: {
    push: jest.fn(),
    pop: jest.fn(),
    showModal: jest.fn(),
    dismissModal: jest.fn(),
    setOnNavigatorEvent: jest.fn(),
    showInAppNotification: jest.fn(),
  },
  isLoading: false,
  goBackFromLotView: jest.fn(),
  lotBucket: 'inProgress', // ?

  charges: {
    isLoading: false,
    data: {},
  },
  lotInfo: {
    isLoading: false,
    data: {},
  },
  isAwaitingSync: false,
  inProgressCache: {},
};

describe('when you are offline', () => {
  let wrapper;
  let rendered;
  let renderedRoot;
  beforeEach(() => {
    Object.keys(defaultProps).forEach((key) => {
      if (defaultProps[key].mockClear) defaultProps[key].mockClear();
    });
    Object.keys(defaultProps.navigator).forEach((key) => {
      if (defaultProps.navigator[key].mockClear) defaultProps.navigator[key].mockClear();
    });

    rendered = renderer.create(<LotView
      {...defaultProps}
      connectionStatus={false}
    />);
    renderedRoot = rendered.root;
  });
  test('offline banner appears', () => {
    expect(renderedRoot.findAllByType(OfflineBanner).length).toBe(1);
  });
  test('it retrieves lot info', () => {
    expect(defaultProps.loadAllLotInfo.mock.calls.length).toBe(1);
  });
  test('and connection is restored, it should retrieve lot Info', () => {
    // TODO
    wrapper = shallow(<LotView
      {...defaultProps}
      connectionStatus={false}
    />);
    wrapper.setProps({ isConnected: true });
    expect(defaultProps.loadAllLotInfo.mock.calls.length).toBe(1);
  });
  test('when you have not started the form before, pressing start pickup/delivery opens LotNotes', () => {
    renderedRoot.instance.handleOnPressPickupOrder();
    expect(defaultProps.navigator.showModal.mock.calls[0][0].screen).toBe(
      'CopartTransporter.LotNotes',
    );
  });
  test('when form has previously been started, shows the correct options');
  test(
    'when form is awaiting submit and you are offline, Pressing start shows the correct options',
  );
  test('when form is awaiting submit and you are online, Pressing start shows the correct options');
  test('something should happen to UnableToPickup... ?');
  test('something should happen to request documents button... ?');
  test('charges show as N/A ?');
});
describe('when you are online', () => {
  let rendered;
  let renderedRoot;
  beforeEach(() => {
    Object.keys(defaultProps).forEach((key) => {
      if (defaultProps[key].mockClear) defaultProps[key].mockClear();
    });
    Object.keys(defaultProps.navigator).forEach((key) => {
      if (defaultProps.navigator[key].mockClear) defaultProps.navigator[key].mockClear();
    });
    defaultProps.loadAllLotInfo.mockClear();

    rendered = renderer.create(<LotView
      {...defaultProps}
      connectionStatus
    />);
    renderedRoot = rendered.root;
  });
  test('there is no offline banner', () => {
    expect(renderedRoot.findAllByType(OfflineBanner).length).toBe(0);
  });
  test('it retrieves lot info', () => {
    expect(defaultProps.loadAllLotInfo.mock.calls.length).toBe(1);
  });
  test('pressing start pickup/delivery opens the pickup notes', () => {
    renderedRoot.instance.handleOnPressPickupOrder();
    expect(defaultProps.navigator.showModal.mock.calls[0][0].screen).toBe(
      'CopartTransporter.LotNotes',
    );
  });

  test('Unable to Pickup works');
  test('Request documents button works');
});
test('when the lot is inProgress and pending sync, the pendingSync is shown in the lot action area', () => {
  const rendered = renderer.create(
    <LotView
      {...defaultProps}
      connectionStatus
      inProgressCache={{ 42: { isAwaitingSync: true } }}
    />,
  );
  const renderedRoot = rendered.root;
  expect(renderedRoot.findAllByType(PendingSync).length).toBe(1);
});
test('when the lot is inProgress and not pending sync, OtherActions is shown in the lot action area', () => {
  const rendered = renderer.create(
    <LotView
      {...defaultProps}
      connectionStatus
      isAwaitingSync={false}
      inProgressCache={{ 42: { isAwaitingSync: false } }}
    />,
  );
  const renderedRoot = rendered.root;
  expect(renderedRoot.findAllByType(OtherActions).length).toBe(1);
});
