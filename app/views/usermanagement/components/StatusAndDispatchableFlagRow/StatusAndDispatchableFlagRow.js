// @flow

import React from 'react';
import { View, Text } from 'react-native';

import colors from 'styles/colors';

const colorMapper = {
  status: {
    I: colors.DARK_RED,
    A: colors.DARK_GREEN,
  },
};

type Props = {
  status: 'A' | 'I',
  dispatchableFlag: boolean,
};

const StatusAndDispatchableFlagRow = ({ status, dispatchableFlag }: Props) => (
  <View style={{ flexDirection: 'row', marginBottom: 4 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
      <Text
        style={{
          marginRight: 5,
          fontSize: 15,
          color: colors.GRAY_DARK_1,
          fontWeight: 'bold',
        }}
      >
        Status:
      </Text>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 5,
          backgroundColor: colorMapper.status[status],
          borderRadius: 4,
          width: 65,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center' }}>
          {status === 'A' ? 'Active' : 'Inactive'}
        </Text>
      </View>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text
        style={{
          marginRight: 5,
          fontSize: 15,
          color: colors.GRAY_DARK_1,
          fontWeight: 'bold',
        }}
      >
        Dispatchable:
      </Text>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 5,
          backgroundColor: dispatchableFlag ? colors.DARK_GREEN : colors.DARK_RED,
          borderRadius: 4,
          width: 65,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center' }}>
          {dispatchableFlag ? 'Yes' : 'No'}
        </Text>
      </View>
    </View>
  </View>
);

export default StatusAndDispatchableFlagRow;
