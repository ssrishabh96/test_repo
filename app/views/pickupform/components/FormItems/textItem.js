import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import renderIf from 'render-if';

import { formStyles } from './styles';
import colors from '../../../../styles/colors';
import { Required, Warning } from './flags';
import Locale from 'utils/locale';

type Props = {
  +key1: string,
  +label: string,
  +value?: string,
  +required: boolean,
  +isCurrency?: boolean,
  +showWarning: boolean,
  +handleOnSelect: () => any,
  +showWarningNotification: () => any,
  +validations?: {
    +maxLength?: number,
  },
  +keyboardType: 'default' | 'numeric',
  autoCapitalize: string,
};

const TextItem = ({
  /* id, */
  key1,
  label,
  value,
  required,
  validations,
  keyboardType,
  isCurrency,
  showWarning,
  handleOnSelect,
  showWarningNotification,
  autoCapitalize,
}: Props) => {
  const renderIfIsRequired = renderIf(required);
  const renderIfCurrency = renderIf(isCurrency);
  return (
    <View style={styles.row}>
      <View style={styles.labelWrapper}>
        {showWarning && <Warning onPress={() => showWarningNotification({ label })} />}
        <Text style={formStyles.label}>{label}</Text>
        {renderIfIsRequired(<Required />)}
      </View>
      <View style={styles.inputWrapper}>
        {renderIfCurrency(
          <Text style={[formStyles.value]}>{Locale.translate('currencySymbol')}</Text>,
        )}
        <TextInput
          style={[formStyles.value, styles.input]}
          value={value}
          maxLength={validations ? validations.maxLength : undefined}
          keyboardType={keyboardType}
          placeholder={isCurrency ? Locale.translate('PickupForm.amountPlaceHolder') : 'XXXXXX'}
          onChangeText={(text: string) => validate(validations, key1, text, handleOnSelect)}
          underlineColorAndroid="transparent"
          autoCapitalize={autoCapitalize}
        />
      </View>
    </View>
  );
};

TextItem.defaultProps = {
  value: '',
  keyboardType: 'default',
  isCurrency: false,
  autoCapitalize: 'sentences',
};
function validate(
  validations: { maxLength: number },
  key1: string,
  value: string,
  handleOnSelect: () => any,
) {
  if (validations) {
    let valid = true;
    if (validations.match && !typeMap[validations.match].test(value)) {
      valid = false;
    }
    if (valid) handleOnSelect(key1, value);
  } else {
    // no validations needed
    handleOnSelect(key1, value);
  }
}
const typeMap = {
  currency: /^\d*(\d\.\d{0,2})?$/,
  numeric: /^\d*$/,
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 40,
    padding: 0,
  },
  inputWrapper: {
    height: 40,
    flexDirection: 'row',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  row: {
    flex: 1,
    minHeight: 45,
    paddingLeft: 10,
    paddingTop: 5,
    paddingRight: 8,
    paddingBottom: 5,
    flexDirection: 'column',
    borderColor: '#EBEBEB',
    borderBottomWidth: 1,
  },
  labelWrapper: {
    flex: 1,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

export default TextItem;
