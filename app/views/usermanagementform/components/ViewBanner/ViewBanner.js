// @flow

import React from 'react';
import { View, Text } from 'react-native';

import colors from 'styles/colors';

type Props = {
  headerTitle: string,
};

const ViewBanner = ({ headerTitle }: Props) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignContent: 'center',
      height: 40,
    }}
  >
    <Text
      style={{
        flex: 1,
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: colors.GRAY_DARK_1,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
    >
      {headerTitle}
    </Text>
  </View>
);

export default ViewBanner;
