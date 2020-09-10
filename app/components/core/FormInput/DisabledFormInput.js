// @flow

import React from 'react';
import { TextInput } from 'react-native';

import colors from 'styles/colors';
import styles from './styles';

const DisabledFormInput = ({ input }: Object) => (
  <TextInput
    style={[
      styles.textInput,
      {
        borderColor: colors.GRAY_DARK,
        color: colors.GRAY_DARK,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1.2,
        fontSize: 16,
      },
    ]}
    editable={false}
    selectTextOnFocus={false}
    value={input.value}
    underlineColorAndroid="transparent"
  />
);

export default DisabledFormInput;
