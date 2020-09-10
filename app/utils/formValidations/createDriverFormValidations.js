// @flow

import Locale from 'utils/locale';

type CreateDriverFormValues = {|
  driverFName?: ?string,
  driverLName?: ?string,
  driverEmail?: ?string,
  driverContactNumber?: ?string,
  driverStartDate?: ?string,
  driverGroup?: ?string,
|};

export const nameValidation = (value: ?string) =>
  // $FlowFixMe
  value && !/^[a-zA-Z ]+$/i.test(value.trim()) ? 'Username must contain only letters!' : undefined;

export const emailValidation = (value: ?string) =>
  // $FlowFixMe
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value.trim())
    ? 'Invalid email address'
    : undefined;

export const contactNumValidation = (value: ?string) =>
  // $FlowFixMe
  value && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/i.test(value.trim())
    ? 'Invalid Contact number'
    : undefined;

export default (values: CreateDriverFormValues): Object => {
  const errors = {};
  // $FlowFixMe
  if (!values.driverFName) {
    errors.driverFName = Locale.translate('userManagement.createDriver.error.firstName');
  }
  // $FlowFixMe
  if (!values.driverLName) {
    errors.driverLName = Locale.translate('userManagement.createDriver.error.lastName');
  }
  // $FlowFixMe
  if (!values.driverEmail) {
    errors.driverEmail = Locale.translate('userManagement.createDriver.error.email');
  }
  // $FlowFixMe
  if (!values.driverContactNumber) {
    errors.driverContactNumber = Locale.translate(
      'userManagement.createDriver.error.contactNumber',
    );
  }
  // $FlowFixMe
  if (!values.driverGroup || values.driverGroup === '' || values.driverGroup === 'Select Group*') {
    errors.driverGroup = Locale.translate('userManagement.createDriver.error.groupName');
  }
  // $FlowFixMe
  if (!values.driverStartDate) {
    errors.driverStartDate = Locale.translate('userManagement.createDriver.error.startDate');
  }
  return errors;
};
