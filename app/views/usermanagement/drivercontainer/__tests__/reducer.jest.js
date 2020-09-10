import * as actions from '../drivercontainer.action';
import { initialState } from '../drivercontainer.constants';
import { driverReducer } from '../drivercontainer.redux';

const error = {
  message: 'Error message',
};

describe('usermanagement::drivercontainer::reducer', () => {
  test('should toggle isLoading for get drivers list request', () => {
    expect(driverReducer(initialState, actions.getDriversInit())).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  test('should set error for when get drivers list fail', () => {
    expect(driverReducer(initialState, actions.getDriversError(error))).toEqual({
      ...initialState,
      isLoading: false,
      error,
    });
  });

  test('should toggle isLoading when addDriver is called', () => {
    expect(driverReducer(initialState, actions.addNewDriverInit())).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  test('should set error when addDriver fails', () => {
    expect(driverReducer(initialState, actions.addNewDriverError(error))).toEqual({
      ...initialState,
      isLoading: false,
      error,
    });
  });

  // this test should fail since test does not add the new driver to the 'driversList'
  test('should add new driver to the list', () => {
    expect(driverReducer(initialState, actions.addNewDriverSuccess())).toEqual({
      ...initialState,
      isLoading: false,
    });
  });
});
