// @flow

import React from 'react';
import { View, Text } from 'react-native';
import renderIf from 'render-if';
import DatePicker from 'react-native-datepicker';

import DisabledFormInput from '../FormInput/DisabledFormInput';

import colors from 'styles/colors';

type Props = {
  input: Object,
  placeholder: ?string,
  meta: Object,
  editable: ?Array<string>,
};
class DatePickerInput extends React.PureComponent {
  render() {
    const { editable, placeholder, input, meta: { touched, error } } = this.props;
    const renderIfDisabled = renderIf(
      editable && editable.length > 0 && !editable.includes(input.name),
    );
    const renderIfNotDisabled = renderIf(
      !editable || editable.length === 0 || (editable && editable.includes(input.name)),
    );
    return (
      <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 7 }}>
        {renderIfDisabled(<DisabledFormInput input={input} />)}
        {renderIfNotDisabled(
          <DatePicker
            customStyles={{
              dateInput: {
                borderBottomColor: touched && error ? colors.DARK_RED : colors.COPART_BLUE,
                borderLeftWidth: 0,
                borderTopWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 1.2,
                alignItems: 'flex-start',
                alignSelf: 'stretch',
              },
              placeholderText: {
                fontSize: 16,
              },
              dateText: {
                color: colors.COPART_BLUE,
                fontSize: 16,
              },
              btnTextConfirm: {
                fontSize: 16,
                color: colors.COPART_BLUE,
              },
            }}
            style={{ width: null }}
            date={input.value}
            mode="date"
            format="YYYY-MM-DD"
            placeholder={placeholder}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            onDateChange={(date: string) => {
              input.onChange(date);
            }}
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

export default DatePickerInput;
