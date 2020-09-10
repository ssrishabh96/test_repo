import React from 'react';
import renderIf from 'render-if';
import DefaultInput from 'components/core/FormInput';
import Button from 'components/core/Button';
import { FormContainer } from 'views/usermanagementform/usermanagementform.style';
import ErrorBox from 'components/custom/FormMessages/errorBox';
import { reduxForm, Field } from 'redux-form';
import { View, KeyboardAvoidingView } from 'react-native';

const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;

const required = value => (value ? undefined : 'Email Required');

type Props = {
  +handleSubmit: Function,
  +buttonLabel: string,
  +error: string | undefined,
  +submitting: boolean,
  +closeForgotPassword: Function,
};
const forgotPasswordForm = ({
  handleSubmit,
  buttonLabel,
  error,
  submitting,
  closeForgotPassword,
}: Props) => {
  const renderIfSubmitError = renderIf(error);
  return (
    <FormContainer style={{ justifyContent: 'center' }}>
      {renderIfSubmitError(<ErrorBox message={error} />)}
      <KeyboardAvoidingView
        behavior="padding"
        style={{ marginVertical: 30 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={false}
      >
        <View>
          <Field
            name="userEmail"
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            maxLength={50}
            component={DefaultInput}
            validate={[required, email]}
            onSubmitEditing={handleSubmit}
          />
        </View>
      </KeyboardAvoidingView>
      <Button
        onPress={handleSubmit}
        style={{ borderRadius: 50, marginBottom: 10 }}
        title={buttonLabel}
        isLoading={submitting}
      />
      <Button
        onPress={closeForgotPassword}
        style={{ backgroundColor: '#c62828', borderRadius: 50 }}
        title={'Cancel'}
      />
    </FormContainer>
  );
};

export default reduxForm({
  form: 'forgotPasswordForm',
})(forgotPasswordForm);
