import React from 'react';
import { View } from 'react-native';
import { reduxForm, Field } from 'redux-form';
import renderIf from 'render-if';

import DefaultInput from 'components/core/FormInput';
import AutoFlow from 'components/core/FormInput/AutoFlow';
import DriverInfoItems from './DriverInfoItems';
import Button from 'components/core/Button';

import createDriverFormValidations, {
  nameValidation,
  contactNumValidation,
} from 'utils/formValidations/createDriverFormValidations';

type Props = {
  groupName: string | 'N/A',
  user: {
    phoneNum?: string,
  },
  handleSubmit: () => any,
  submitting: boolean,
  type: 'UpdateProfile' | 'EditDriver',
};
const DriverProfileUpdateForm = ({ type, user, groupName, handleSubmit, submitting }: Props) => (
  <View
    style={{
      flex: 1,
      margin: 5,
      padding: 10,
    }}
  >
    <View style={{ marginBottom: 30 }}>
      <AutoFlow>
        <Field
          name="driverFName"
          placeholder="First Name*"
          maxLength={50}
          component={DefaultInput}
          keyboardType="default"
          validate={nameValidation}
        />
        <Field
          name="driverMName"
          placeholder="Middle Name"
          maxLength={50}
          component={DefaultInput}
          keyboardType="default"
          validate={nameValidation}
        />
        <Field
          name="driverLName"
          placeholder="Last Name*"
          maxLength={50}
          component={DefaultInput}
          keyboardType="default"
          validate={nameValidation}
        />
        <Field
          name="driverContactNumber"
          placeholder="Contact Number*"
          maxLength={50}
          component={DefaultInput}
          keyboardType="numeric"
          validate={contactNumValidation}
          returnKeyType="done" // helps closing numeric keyboards
        />
        {/* (
            <Field
              name="driverGroup"
              placeholder="Group*"
              isPicker
              onOpenPicker={openGroupPicker}
              placeholderValue={'Group'}
              component={PickerInput}
              editable={editable}
            />,
          ) */}
      </AutoFlow>
      <DriverInfoItems
        user={user}
        groupName={groupName}
      />
    </View>
    <Button
      onPress={handleSubmit}
      style={{ borderRadius: 50, marginBottom: 10 }}
      titleStyle={{ fontSize: 16 }}
      title={'Update'}
      isLoading={submitting}
    />
  </View>
);

const DriverForm = reduxForm({
  form: 'driverProfileUpdateForm',
  validate: createDriverFormValidations,
  enableReinitialize: true,
})(DriverProfileUpdateForm);

export default DriverForm;
