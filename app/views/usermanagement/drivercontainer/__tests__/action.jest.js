import * as actions from '../drivercontainer.action';
import {
  GET_DRIVERS_LIST_INIT,
  GET_DRIVERS_LIST_ERROR,
  GET_DRIVERS_LIST_FULFILLED,
  ADD_DRIVER_REQUEST,
  ADD_DRIVER_ERROR,
  ADD_DRIVER_SUCCESS,
} from '../drivercontainer.constants';

const driverData = [];

// const newDriver = {
//   firstName: 'First',
//   middleName: null,
//   lastName: 'Last',
//   phoneNum: '1234567890',
//   email: 'abc@test.com',
//   role: '3',
//   startDate: '2018-03-22',
//   vendorId: 4192,
//   dateOfBirth: null,
//   pcardFlg: 'N',
//   createUser: 'some-user@copart.com',
//   lastUpdateUser: 'some-user@copart.com',
//   sourceSystem: 'mobile',
// };

const error = {
  message: 'Foo Message',
};

describe('usermanagement::drivercontainer::action', () => {
  test('should create proper action for getDrivers isLoading state', () => {
    const expectedAction = {
      type: GET_DRIVERS_LIST_INIT,
    };
    expect(actions.getDriversInit()).toEqual(expectedAction);
  });

  test('should create proper action for getDrivers error state', () => {
    const expectedAction = {
      type: GET_DRIVERS_LIST_ERROR,
      error,
    };
    expect(actions.getDriversError(error)).toEqual(expectedAction);
  });

  test('should create proper action for getDrivers fullfilled state', () => {
    const expectedAction = {
      type: GET_DRIVERS_LIST_FULFILLED,
      data: driverData,
    };
    expect(actions.getDriversSuccess(driverData)).toEqual(expectedAction);
  });

  test('should create proper action for addNewDriver success state', () => {
    const expectedAction = {
      type: ADD_DRIVER_REQUEST,
    };
    expect(actions.addNewDriverInit()).toEqual(expectedAction);
  });

  test('should create proper action for addNewDriver error state', () => {
    const expectedAction = {
      type: ADD_DRIVER_ERROR,
      error,
    };
    expect(actions.addNewDriverError(error)).toEqual(expectedAction);
  });

  test('should create proper action for addNewDriver fullfilled state', () => {
    const expectedAction = {
      type: ADD_DRIVER_SUCCESS,
    };
    expect(actions.addNewDriverSuccess()).toEqual(expectedAction);
  });
});
