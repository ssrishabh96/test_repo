import { configureReduxStore } from 'utils/test/testSetup';
import { UPDATE_TRIP_BY_TYPE } from '../trips.constants';
import { assignTrips, removeLotsFromTrip } from '../trips.actions';
import * as lotlistService from '../../lotlist/lotlist.service';

describe('Trip Actions', () => {
  test('trip actions test here', () => {
    expect(true).toBeTruthy();
  });
});
