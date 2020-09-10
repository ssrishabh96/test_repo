// @flow

import React from 'react';
import { View, Text } from 'react-native';

import colors from 'styles/colors';

type Props = {
  label: string,
  value: string,
};

const ProfileMiniInfoItem = ({ label, value }: Props) => (
  <View style={{ flexDirection: 'row', marginBottom: 4 }}>
    <Text
      style={{
        marginRight: 5,
        fontSize: 15,
        color: colors.GRAY_DARK_1,
        fontWeight: 'bold',
      }}
    >
      {label}:
    </Text>
    <Text style={{ fontSize: 15, color: colors.GRAY_DARK }}>{value}</Text>
  </View>
);

export default ProfileMiniInfoItem;
