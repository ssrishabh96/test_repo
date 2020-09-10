import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';

import colors from 'styles/colors';

const propTypes = {
  count: PropTypes.number.isRequired,
  containerStyle: PropTypes.string,
  textStyle: PropTypes.string,
};

const defaultProps = {
  containerStyle: '',
  textStyle: '',
};

const CountBadge = ({ count, containerStyle, textStyle }) => (
  <Animatable.View
    animation="bounceIn"
    delay={0}
    duration={2500}
    style={[
      styles.container,
      {
        borderRadius: 15,
        borderColor: 'transparent',
      },
      containerStyle,
    ]}
  >
    <Text style={[styles.countText, textStyle]}>{count}</Text>
  </Animatable.View>
);

CountBadge.propTypes = propTypes;
CountBadge.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.DARK_RED,
  },
  countText: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
    color: 'white',
    backgroundColor: 'transparent',
  },
});

export default CountBadge;
