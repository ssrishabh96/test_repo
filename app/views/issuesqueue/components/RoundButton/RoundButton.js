/**
 * @flow
 */

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

type Props = {
  btnLabel: string,
  btnColor: string,
  onPress: () => void,
  style: Object,
};

const RoundButton = ({ btnLabel, btnColor, onPress, style }: Props) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      style,
      {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: btnColor,
        height: 55,
        marginRight: 5,
        marginVertical: 10,
        borderRadius: 55 / 2,
      },
    ]}
  >
    <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>{btnLabel}</Text>
  </TouchableOpacity>
);

export default RoundButton;
