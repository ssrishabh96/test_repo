import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { validate } from '../signup.utils';

import Button from '../../../components/core/Button';
import FormInput from './FormTextInput';

import styles from '../signup.style';

const SignUpForm = ({
  onFormSubmit,
  handleSubmit,
  submitting,
}) => (
  <ScrollView style={{ flex: 1 }}>
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={false}
      >
        <Field
          name="firstName"
          placeholder="First Name"
          autoCapitalize="sentences"
          maxLength={50}
          component={FormInput}
          autoFocus
        />
        <Field
          name="lastName"
          placeholder="Last Name"
          autoCapitalize="words"
          maxLength={50}
          component={FormInput}
        />
        <Field
          name="emailId"
          placeholder="Email Address"
          autoCapitalize="none"
          isEmail
          maxLength={50}
          component={FormInput}
        />
        <Field
          name="userTypeCode"
          placeholder="S(ubhauler) or B(uyer) ?"
          autoCapitalize="characters"
          maxLength={1}
          component={FormInput}
        />
        <View>
          <Field
            name="password"
            placeholder="Password"
            maxLength={50}
            isPassword
            autoCapitalize="none"
            component={FormInput}
          />
          <Text style={{ marginLeft: 15 }}>
            1. At least one upper-case letter {'\n'}
            2. At least one speacial character ( !, #, $, etc.) {'\n'}
            3. Atleast one number ( 0-9 ) {'\n'}
            4. Atleast 8 characters
          </Text>
        </View>
        <Field
          name="confirmPassword"
          placeholder="Re-Enter Password"
          maxLength={50}
          isPassword
          autoCapitalize="none"
          component={FormInput}
        />
      </KeyboardAvoidingView>
    </View>
    <Button
      onPress={handleSubmit(onFormSubmit)}
      style={{ margin: 20 }}
      title="SIGNUP"
      isLoading={submitting}
    />
    <View style={{ margin: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        Already Registered ? Login here!
      </Text>
    </View>
  </ScrollView>
);

SignUpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};

SignUpForm.defaultProps = {
  submitting: false,
};

const ConnectedSignUp = reduxForm({
  form: 'signUpForm',
  validate,
})(SignUpForm);

export default ConnectedSignUp;
