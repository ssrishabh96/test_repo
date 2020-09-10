// @flow

import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { ViewHeader as Header } from './styles';

type Props = {
  issue: Object,
};

export default function IssueBanner(props: Props) {
  const { issue } = props;
  return (
    <Header>
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>{issue || 'N/A'}</Text>
      <Icon
        name={'exclamation-circle'}
        color={'white'}
        size={28}
      />
    </Header>
  );
}
