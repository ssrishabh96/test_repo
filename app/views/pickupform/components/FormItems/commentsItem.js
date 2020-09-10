import React from 'react';
import { View, Text, TextInput } from 'react-native';
import renderIf from 'render-if';

import colors from '../../../../styles/colors';
import { formStyles } from './styles';
import { Required, Warning } from './flags';

type Props = {
  +key1: string,
  +label: string,
  +value?: string,
  +required: boolean,
  +showWarning: boolean,
  +handleOnSelect: () => any,
  +showWarningNotification: () => any,
  +validations?: {
    +maxLength?: number,
  },
};
const TextItem = ({
  /* id, */
  key1,
  label,
  value,
  required,
  showWarning,
  validations,
  handleOnSelect,
  showWarningNotification,
}: Props) => {
  const renderIfIsRequired = renderIf(required);
  return (
    <View
      style={{
        flex: 1,
        minHeight: 45,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: '#F8F8F8',
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingTop: 3,
        }}
      >
        {showWarning && <Warning onPress={() => showWarningNotification({ label })} />}
        <Text style={formStyles.label}>{label}</Text>
        {renderIfIsRequired(<Required />)}
      </View>
      <TextInput
        style={[
          formStyles.value,
          { height: 100, borderColor: 'gray', borderWidth: 1, top: 10, padding: 10 },
        ]}
        value={value}
        placeholder={'XXXXXX'}
        multiline
        onChangeText={(text: string) => validate(validations, key1, text, handleOnSelect)}
        underlineColorAndroid="transparent"
        autoCapitalize="sentences"
      />
    </View>
  );
};

TextItem.defaultProps = {
  value: '',
  validations: {},
};
function validate(
  validations: { maxLength: number },
  key1: string,
  value: string,
  handleOnSelect: () => any,
) {
  if (validations && validations.maxLength) {
    if (value.length <= validations.maxLength) handleOnSelect(key1, value);
  } else {
    // no validations needed
    handleOnSelect(key1, value);
  }
}
export default TextItem;
