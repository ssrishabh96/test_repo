import React from 'react';
import { View, Text, TextInput } from 'react-native';
import renderIf from 'render-if';
import PropTypes from 'prop-types';

import DisabledFormInput from './DisabledFormInput';

import colors from 'styles/colors';
import styles from './styles';

class FormInput extends React.Component {
  static propTypes = {
    input: PropTypes.object.isRequired, // eslint-disable-line
    onSubmitEditing: PropTypes.func,
    placeholder: PropTypes.string,
    autoCapitalize: PropTypes.string,
    maxLength: PropTypes.number,
    isPassword: PropTypes.bool,
    disabled: PropTypes.bool,
    isEmail: PropTypes.bool,
    isCountryField: PropTypes.bool,
    isPicker: PropTypes.bool,
    returnKeyType: PropTypes.string,
    onOpenPicker: PropTypes.func,
    fieldValue: PropTypes.string,
    placeholderValue: PropTypes.string,
    keyboardType: PropTypes.string,
    editable: PropTypes.arrayOf(PropTypes.string),
    styles: PropTypes.object, // eslint-disable-line
    meta: PropTypes.object.isRequired, // eslint-disable-line
  };

  static defaultProps = {
    placeholder: '',
    autoCapitalize: 'words',
    maxLength: 50,
    disabled: false,
    isPassword: false,
    isEmail: false,
    isCountryField: false,
    isPicker: false,
    fieldValue: '',
    returnKeyType: null,
    editable: null,
    styles: {},
    placeholderValue: 'One Value...',
    keyboardType: 'default',
    onOpenPicker: x => x,
    onSubmitEditing: x => x,
  };
  focus = () => {
    if (this.textInput) this.textInput.focus();
  };
  render() {
    const {
      input: { onChange, ...input },
      placeholder,
      autoCapitalize,
      maxLength,
      isPassword,
      keyboardType,
      editable,
      returnKeyType,
      onSubmitEditing,
      meta: { touched, error },
    } = this.props;

    const renderIfDisabled = renderIf(
      editable && editable.length > 0 && !editable.includes(input.name),
    );
    const renderIfNotDisabled = renderIf(
      !editable || editable.length === 0 || (editable && editable.includes(input.name)),
    );
    return (
      <View style={{ padding: 5 }}>
        {renderIfDisabled(<DisabledFormInput input={input} />)}
        {renderIfNotDisabled(
          <TextInput
            ref={(r) => {
              this.textInput = r;
            }}
            onChangeText={onChange}
            style={[
              styles.textInput,
              {
                borderColor: touched && error ? colors.DARK_RED : colors.COPART_BLUE,
                color: touched && error ? colors.DARK_RED : colors.COPART_BLUE,
                borderLeftWidth: 0,
                borderTopWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 1.2,
                fontSize: 16,
                ...this.props.styles,
                // marginTop: touched && error ? 8 : 12,
              },
            ]}
            placeholder={placeholder}
            autoCapitalize={autoCapitalize}
            maxLength={maxLength}
            underlineColorAndroid="transparent"
            secureTextEntry={isPassword || false}
            keyboardType={keyboardType}
            autoCorrect={false}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            {...input}
          />,
        )}
        {touched &&
          error && (
            <Text
              style={{
                color: colors.DARK_RED,
                fontWeight: 'bold',
                margin: 5,
              }}
            >
              {error}
            </Text>
          )}
      </View>
    );
  }
}

export default FormInput;
