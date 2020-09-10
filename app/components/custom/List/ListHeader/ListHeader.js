// @flow

import type { Node } from 'react';

import React from 'react';
import { View, Text } from 'react-native';

import colors from 'styles/colors';

type Props = {
  +title: string,
  +subtitle: string,
  +actions: ?Node,
};

const ListHeader = ({ title, subtitle, actions }: Props) => (
  <View
    style={{
      backgroundColor: colors.GRAY_DARK_1,
      height: 44,
      paddingVertical: 5,
      paddingHorizontal: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <View style={{ maxWidth: 220 }}>
      <Text
        style={{
          color: '#fefefe',
          fontWeight: 'bold',
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
      <Text
        style={{
          color: 'rgb(248, 231, 28)',
          fontWeight: 'bold',
        }}
      >
        {subtitle}
      </Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>{actions}</View>
  </View>
);

ListHeader.defaultProps = {
  title: '',
  subtitle: '',
  actions: null,
};

export default ListHeader;
