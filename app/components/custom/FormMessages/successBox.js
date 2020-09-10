import React from 'react';
import { Text } from 'react-native';

import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

type Props = {
  message: string,
};
export default ({ message, style }: Props) => (
  <Animatable.View
    animation="bounceIn"
    delay={0}
    duration={2500}
    style={[styles.successBox, style]}
  >
    <Icon
      size={22}
      name={'check'}
      color={'white'}
      style={{ marginHorizontal: 10 }}
    />
    <Text style={styles.errorMessage}>{message}</Text>
  </Animatable.View>
);
