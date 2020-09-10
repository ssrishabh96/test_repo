import React from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import renderIf from 'render-if';
import { reduxForm, Field } from 'redux-form';

import DefaultInput from 'components/core/FormInput';
import Button from 'components/core/Button';
import Locale from 'utils/locale';
import { FormContainer } from 'views/usermanagementform/usermanagementform.style';

import ErrorBox from 'components/custom/FormMessages/errorBox';
import SuccessBox from 'components/custom/FormMessages/successBox';

type Props = {
  handleSubmit: () => any,
  error: string,
  anyTouched: boolean,
  cancleChangePassword: () => any,
  submitting: boolean,
};
const Form = ({ cancleChangePassword, handleSubmit, error, submitting, anyTouched }: Props) => {
  const renderIfError = renderIf(anyTouched && error);
  return (
    <FormContainer>
      {renderIfError(<ErrorBox message={error} />)}
      <KeyboardAvoidingView
        behavior="padding"
        style={{ marginBottom: 40 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={false}
      >
        <View>
          <Field
            name="oldPassword"
            placeholder={Locale.translate('settings.ChangePassword.OldPassword')}
            autoCapitalize="none"
            keyboardType="default"
            isPassword
            component={DefaultInput}
          />
          <Field
            name="newPassword"
            placeholder={Locale.translate('settings.ChangePassword.NewPassword')}
            autoCapitalize="none"
            keyboardType="default"
            isPassword
            component={DefaultInput}
          />
          <Field
            name="confirmPassword"
            type="password"
            placeholder={Locale.translate('settings.ChangePassword.ConfirmPassword')}
            autoCapitalize="none"
            keyboardType="default"
            isPassword
            component={DefaultInput}
          />
        </View>
      </KeyboardAvoidingView>

      <Button
        onPress={handleSubmit}
        style={{ borderRadius: 50, marginBottom: 10 }}
        title={Locale.translate('settings.ChangePassword.Update')}
        isLoading={submitting}
      />
      <Button
        onPress={cancleChangePassword}
        style={{ backgroundColor: '#c62828', borderRadius: 50 }}
        title={Locale.translate('Cancel')}
      />
    </FormContainer>
  );
};

const validate = (values) => {
  const errors = {};
  if (!values.oldPassword && !values.newPassword && !values.confirmPassword) {
    errors._error = Locale.translate('settings.ChangePassword.allFieldBlank');
    errors.oldPassword = '';
    errors.newPassword = '';
    errors.confirmPassword = '';
  } else {
    if (!values.oldPassword) {
      errors.oldPassword = Locale.translate('settings.ChangePassword.error.OldPassword');
    }
    if (!(values.newPassword === values.confirmPassword)) {
      errors.newPassword = Locale.translate('settings.ChangePassword.error.PasswordNoMatch');
      errors.confirmPassword = Locale.translate('settings.ChangePassword.error.PasswordNoMatch');
    }
    if (!values.newPassword) {
      errors.newPassword = Locale.translate('settings.ChangePassword.error.Password');
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = Locale.translate('settings.ChangePassword.error.ConfirmPassword');
    }
    // if (values.newPassword && values.newPassword.length < 8) {
    //   errors.newPassword = 'Password must be longer than 8 characters';
    // }
  }
  return errors;
};
export default reduxForm({
  form: 'changePasswordForm',
  validate,
})(Form);
