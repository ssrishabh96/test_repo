// @flow

import { Trip } from 'types/Trip';

import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { ViewHeader as Header } from './styles';

type Props = {
  trip: Trip,
};

export default ({ trip }: Props) => (
  <Header>
    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>
      {`TRIP - ${trip.tripId} | ${trip.tripName}`}
    </Text>
    <Icon
      name={'exclamation-circle'}
      color={'white'}
      size={28}
    />
  </Header>
);
