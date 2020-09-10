import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput } from 'react-native';
import styles from '../signup.style';
import colors from '../../../styles/colors';

const FormInput = ({
  input: { onChange, ...restInput },
  placeholder,
  autoCapitalize,
  maxLength,
  isPassword,
  isEmail,
  meta: { touched, error },
}) => (
  <View>
    <TextInput
      onChangeText={onChange}
      style={[
        styles.textInput,
        {
          width: '100%',
          borderColor: touched && error ? 'red' : colors.COPART_BLUE,
        },
      ]}
      placeholder={placeholder}
      autoCapitalize={autoCapitalize}
      maxLength={maxLength}
      underlineColorAndroid="transparent"
      secureTextEntry={isPassword || false}
      keyboardType={isEmail ? 'email-address' : 'default'}
      autoCorrect={false}
      {...restInput}
    />
    {touched && error && <Text style={{ color: 'red', fontWeight: 'bold' }}>{error}</Text>}
  </View>
);

FormInput.propTypes = {
  input: PropTypes.object.isRequired, // eslint-disable-line
  placeholder: PropTypes.string,
  autoCapitalize: PropTypes.string,
  maxLength: PropTypes.number,
  isPassword: PropTypes.bool,
  isEmail: PropTypes.bool,
  meta: PropTypes.object.isRequired, // eslint-disable-line
};

FormInput.defaultProps = {
  placeholder: '',
  autoCapitalize: true,
  maxLength: 50,
  isPassword: false,
  isEmail: false,
};

export default FormInput;
