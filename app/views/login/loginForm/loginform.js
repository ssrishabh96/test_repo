import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { pathOr } from 'ramda';
import { Field, reduxForm } from 'redux-form';
import renderIf from 'render-if';
import Submit from 'components/core/Button';
import FormInput from './formInput';
import Locale from 'utils/locale';
import { OfflineBanner } from 'components/custom/Banner';

import styles from './styles';
import ErrorBox from 'components/custom/FormMessages/errorBox';
import { connect } from 'react-redux';

const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;

const required = value => (value ? undefined : 'Required');

const ForgotPassButton = ({ onPress }: Object) => (
  <View style={styles.forgotWraper}>
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.forgotText}>
        {Locale.translate('settings.ForgotPassword.ForgotPassword?')}
      </Text>
    </TouchableOpacity>
  </View>
);

type Props = {
  submitting: boolean,
  isLoading: boolean,
  openForgotPassword: () => any,
  handleSubmit: () => any,
  error: undefined | string,
  invalid: boolean,
  connectionStatus: boolean,
};
const LoginForm = ({
  submitting,
  isLoading,
  openForgotPassword,
  handleSubmit,
  error,
  invalid,
  connectionStatus,
  ...props
}: Props) => {
  const renderIfIsOffline = renderIf(!connectionStatus);
  const renderIfSubmissionError = renderIf(props.loginError);

  return (
    <View
      // behavior={Platform.OS === 'ios' ? 'padding' : ''}
      // keyboardVerticalOffset={15}
      style={styles.formContainer}
    >
      {renderIfIsOffline(<OfflineBanner />)}
      {renderIfSubmissionError(<ErrorBox message={props.loginError} />)}
      <Field
        name="email"
        placeholder="Email"
        keyboardType="email-address"
        maxLength={50}
        validate={[required, email]}
        component={FormInput}
      />
      <Field
        name="loginPassword"
        placeholder="Password"
        secureTextEntry
        component={FormInput}
        validate={required}
        onSubmitEditing={handleSubmit}
      />
      <ForgotPassButton onPress={openForgotPassword} />
      <Submit
        isLoading={isLoading}
        style={[styles.submit, invalid && styles.disabledSubmit]}
        titleStyle={styles.submitText}
        title="Sign In"
        onPress={handleSubmit}
      />
    </View>
  );
};

const loginForm = reduxForm({
  form: 'login',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(LoginForm);

const mapStateToProps = (state, ownProps) => {
  let loginInitialValue = {};
  loginInitialValue = {
    email: ownProps.loginForm.username,
    loginPassword: pathOr(undefined, ['form', 'login', 'values', 'loginPassword'], state),
  };
  return {
    initialValues: loginInitialValue,
  };
};
export default connect(mapStateToProps)(loginForm);
