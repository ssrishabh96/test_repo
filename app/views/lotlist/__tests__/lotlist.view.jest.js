import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import LotList from '../lotlist.view';
import { OfflineBanner } from 'components/custom/Banner';
import LotItem from '../components/LotItem';
import AwaitingSyncView from '../components/AwaitingSyncView';

jest.mock('../components/LotDistance/lotDistance', () => 'lotDistance');

const Lot1 = {
  dispatch_assignment_detail_id: 42,
  tripType: 'P',
  formType: 'P',
  source: { line_1: 123, city: 'plano', state: 'TX', zip: 75075 },
  destination: { line_1: null, city: null, state: null, zip: null },
  description: 'Blue Honda',
  vehicleImages: undefined,
};
const Lot2 = {
  dispatch_assignment_detail_id: 43,
  tripType: 'P',
  formType: 'P',
  source: { line_1: 123, city: 'plano', state: 'TX', zip: 75075 },
  destination: { line_1: null, city: null, state: null, zip: null },
  description: 'Blue Honda',
  vehicleImages: undefined,
};
const awaitingSubmitLot = {
  dispatch_assignment_detail_id: 44,
  tripType: 'P',
  formType: 'P',
  source: { line_1: 123, city: 'plano', state: 'TX', zip: 75075 },
  destination: { line_1: null, city: null, state: null, zip: null },
  description: 'Blue Honda',
  vehicleImages: undefined,
};
const defaultProps = {
  type: 'inProgress',
  fetchData: jest.fn(),
  setCurrentLotList: jest.fn(),
  toggleSelection: jest.fn(),
  clearSelection: jest.fn(),
  setMultiselectMode: jest.fn(),
  resetMultiselectMode: jest.fn(),
  checkInLots: jest.fn(),
  showSearch: jest.fn(),
  resetSearch: jest.fn(),
  resetAllFilters: jest.fn(),
  setSearchQuery: jest.fn(),
  filterWithQuery: jest.fn(),
  acknowledgeTrip: jest.fn(),
  getInProgressLotList: jest.fn(),
  setSelectedFilters: jest.fn(),
  getInTransitLotList: jest.fn(),
  getCompletedLotList: jest.fn(),
  handleSortChangeForLotList: jest.fn(),
  toggleSortVisibility: jest.fn(),
  toggleFilterVisibility: jest.fn(),
  count: 2,
  lotList: {
    isLoading: false,
    lots: [Lot1, Lot2],
    filteredLots: [Lot1, Lot2],
    count: 0,
    filters: {
      selectedFilters: {},
      totalCount: 0,
      isVisible: false,
    },
    sort: {
      isModalVisible: false,
      selectedField: {},
    },
    search: {
      query: '',
      visible: false,
    },
  },
  lots: [Lot1, Lot2],
  filteredLots: [Lot1, Lot2],
  isLoading: false,
  multiselect: {
    active: false,
    type: '',
  },
  role: 0, // Driver?
  navigator: {
    push: jest.fn(),
    pop: jest.fn(),
    showModal: jest.fn(),
    dismissModal: jest.fn(),
    setOnNavigatorEvent: jest.fn(),
    showInAppNotification: jest.fn(),
  },
  hasIssue: false,
  connectionStatus: false,
  inProgressCache: {
    42: {
      lot: Lot1,
      isAwaitingSync: true,
    },
  },
  // trip: getTrip,
  // error: getError,
  // selectedLots: getSelectedLots,
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
    wrapper = shallow(<LotList
      {...defaultProps}
      connectionStatus={false}
    />);
    rendered = renderer.create(<LotList
      {...defaultProps}
      connectionStatus={false}
    />);
    renderedRoot = rendered.root;
  });
  test('offline banner appears', () => {
    expect(renderedRoot.findAllByType(OfflineBanner).length).toBe(1);
  });
  test('does not attempt calling the service on Appear', () => {
    renderedRoot.instance.onNavigatorEvent({ id: 'willAppear' });
    expect(defaultProps.getInProgressLotList.mock.calls.length).toBe(0);
  });
  test('lots remain', () => {
    expect(renderedRoot.findAllByType(LotItem).length).toBe(2);
  });
  test('refreshing the list does not call service and shows notification', () => {
    renderedRoot.instance.handleRefresh();
    expect(defaultProps.getInProgressLotList.mock.calls.length).toBe(0);
    expect(defaultProps.navigator.showInAppNotification.mock.calls.length).toBe(1);
  });
  test(
    'and you submit a form and return to inProgress, that lot remains in list, but has an awaiting sync banner',
  );
  test('if a lot is awaiting sync it should show an awaiting sync banner', () => {
    expect(renderedRoot.findAllByType(AwaitingSyncView).length).toBe(1);
  });
  test('leaving the view resets the filters but does not reload the list', () => {
    wrapper.instance().onNavigatorEvent({ id: 'didDisappear' });
    expect(defaultProps.resetAllFilters.mock.calls.length).toBe(1);
    // TODO testing the reload part
  });
  test('sync button disappears in header');
  test('sort should do something...');
  test('filter should do something...');
  test('map should do something...');
  test('search should do something...');
  test('when you come back online, the list should connect to the service', () => {
    // TODO
    wrapper.setProps({ isConnected: true });
    expect(defaultProps.getInProgressLotList.mock.calls.length).toBe(1);
  });
});
describe('when you are online', () => {
  let wrapper;
  let rendered;
  let renderedRoot;
  beforeEach(() => {
    Object.keys(defaultProps).forEach((key) => {
      if (defaultProps[key].mockClear) defaultProps[key].mockClear();
    });
    wrapper = shallow(<LotList
      {...defaultProps}
      connectionStatus
    />);
    rendered = renderer.create(<LotList
      {...defaultProps}
      connectionStatus
    />);
    renderedRoot = rendered.root;
  });
  test('offline banner disappears', () => {
    expect(renderedRoot.findAllByType(OfflineBanner).length).toBe(0);
  });
  test('sync button appears in header (if lots to sync)');
  test('it should attempt calling the service on Appear', () => {
    renderedRoot.instance.onNavigatorEvent({ id: 'willAppear' });
    expect(defaultProps.getInProgressLotList.mock.calls.length).toBe(1);
  });
  test('leaving the view resets the filters and reloads the list', () => {
    wrapper.instance().onNavigatorEvent({ id: 'didDisappear' });
    expect(defaultProps.resetAllFilters.mock.calls.length).toBe(1);
    // TODO test the reload part
  });
  test('if a lot is awaiting sync it should show an awaiting sync banner', () => {
    expect(renderedRoot.findAllByType(AwaitingSyncView).length).toBe(1);
  });
  test('when you press sync on an item, or in the header? it goes to a separate syncing view', () => {});
  test('handleSyncAll finds all the ids in need of sync');
});
