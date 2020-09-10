import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
import Locale from 'utils/locale';

import DisabledFormInput from '../FormInput/DisabledFormInput';

import colors from 'styles/colors';
import icons from 'constants/icons';

export default class PickerInput extends React.Component {
  static propTypes = {
    placeholderValue: PropTypes.string.isRequired,
    onOpenPicker: PropTypes.func.isRequired,
    onCountrySelect: PropTypes.func,
    editable: PropTypes.arrayOf(PropTypes.string),
    styles: PropTypes.object, // eslint-disable-line
    isDisabled: PropTypes.any, // eslint-disable-line
    input: PropTypes.object.isRequired, // eslint-disable-line
    meta: PropTypes.object.isRequired, // eslint-disable-line
  };

  static defaultProps = {
    onCountrySelect: x => x,
    isDisabled: false,
    editable: null,
  };

  onChange = (value) => {
    if (this.props.input.name === 'country') {
      // dispatch a callback to load states list by country value
      if ('onCountrySelect' in this.props) {
        // load states list by country value
        this.props.onCountrySelect(value);
      }
    }
    this.props.input.onChange(value);
  };

  handleOnPress = () => {
    this.props.onOpenPicker(this.onChange); // send callback to picker list
  };

  render() {
    const { input, placeholderValue, isDisabled, editable, meta: { touched, error } } = this.props;
    // const disabled = input.name === 'state' && !isDisabled;
    const isState = input.name === 'state';

    const renderIfDisabled = renderIf(
      editable && editable.length > 0 && !editable.includes(input.name),
    );
    const renderIfNotDisabled = renderIf(
      !editable || editable.length === 0 || (editable && editable.includes(input.name)),
    );
    return (
      <View
        style={{
          paddingLeft: 5,
        }}
      >
        {renderIfDisabled(<DisabledFormInput input={input} />)}
        {renderIfNotDisabled(
          <View>
            <TouchableOpacity
              onPress={this.handleOnPress}
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderColor: touched && error ? colors.DARK_RED : colors.COPART_BLUE,
                  marginTop: touched && error ? 8 : 12,
                  opacity: isState && !isDisabled ? 0.5 : 1,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: touched && error ? colors.DARK_RED : colors.COPART_BLUE,
                }}
              >
                {this.props.input.value.toUpperCase() ||
                  `${Locale.translate('Select')} ${placeholderValue}*`}
              </Text>
              <View
                style={{
                  marginRight: 3,
                  // borderWidth: 1.5,
                  borderColor: touched && error ? colors.DARK_RED : colors.COPART_BLUE,
                }}
              >
                <Image
                  source={icons.dropDownIcon}
                  style={{
                    height: 24,
                    width: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                    tintColor: colors.COPART_BLUE,
                  }}
                />
              </View>
            </TouchableOpacity>
            <View>
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
          </View>,
        )}
      </View>
    );
  }
}
