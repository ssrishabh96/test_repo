import { configureReduxStore } from 'utils/test/testSetup';
import { UPDATE_TRIP_BY_TYPE } from 'views/trips/trips.constants';
import {
  initialState,
  LOTLIST_REQUESTED,
  LOTLIST_LOADED,
  UPDATE_INTRANSIT_LIST,
  UPDATE_COMPLETED_LIST,
  CLEAR_SELECTION,
  RESET_MULTISELECT_MODE,
} from '../lotlist.constants';
import * as actions from '../lotlist.action';
import * as lotlistService from '../lotlist.service';
import { LOT_STATUSES } from 'constants/Lot';

jest.mock('../lotlist.service', () => ({
  getAssignmentsCommonService: jest.fn(() => Promise.resolve({ lots: [] })),
}));
const MOCK_NAVIGATOR = {
  dismissModal: () => {},
  showInAppNotification: () => {},
};

describe('Lot List Actions', () => {
  test('lotlist test', () => {
    expect(true).toBeTruthy();
  });
  describe('getLotsCommonAction()', () => {
    test('dispatches requested and loaded actions', async () => {
      const store = configureReduxStore({ lotlist: initialState });
      lotlistService.getAssignmentsCommonService.mockImplementation(() =>
        Promise.resolve({ lots: [] }),
      );
      const expectedActions = [
        { type: LOTLIST_REQUESTED, bucket: 'inProgress' },
        { type: LOTLIST_LOADED, bucket: 'inProgress', lots: [], count: 0 },
      ];
      expect.assertions(2);
      try {
        await store.dispatch(
          actions.getLotsCommonAction({
            bucket: 'inProgress',
            status: undefined,
            filter: undefined,
            sort: undefined,
            search: undefined,
            otherFilterParams: undefined,
            navigator: MOCK_NAVIGATOR,
            updateList: true,
          }),
        );
      } catch (e) {
        console.log(e);
      } finally {
        expect(store.getActions()).toContainEqual(expectedActions[0]);
        expect(store.getActions()).toContainEqual(expectedActions[1]);
      }
    });
  });
});
