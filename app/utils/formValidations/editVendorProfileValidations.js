// @flow

type EditVendorProfileValues = {
  contactName?: string,
  phoneNumber?: string,
};

export default ({ contactName, phoneNumber }: EditVendorProfileValues) => {
  const errors = {};
  if (!contactName || contactName === '') {
    errors.contactName = 'Contact Name Required*';
  }
  if (!phoneNumber || phoneNumber.length < 0 || phoneNumber.length > 10) {
    errors.phoneNumber = '10 digit Phone Number Required*';
  }
  return errors;
};
