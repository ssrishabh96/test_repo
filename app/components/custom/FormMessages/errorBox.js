import React from 'react';
import { Text } from 'react-native';

import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

type Props = {
  message: string,
};
export default class ErrorBox extends React.Component<Props> {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    console.log(nextProps);
    return nextProps.message !== this.props.message;
  }

  render() {
    const { message } = this.props;
    return (
      <Animatable.View
        animation="bounceIn"
        delay={0}
        duration={2500}
        style={styles.errorBox}
      >
        <Icon
          size={22}
          name={'exclamation'}
          color={'white'}
        />
        <Text style={styles.errorMessage}>{message}</Text>
      </Animatable.View>
    );
  }
}
