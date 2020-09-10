import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import colors from '../../../styles/colors';

const style = StyleSheet.create({
  container: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  // style: View.propTypes.style,
  // titleStyle: View.propTypes.style,
  isLoading: PropTypes.bool,
};

const defaultProps = {
  style: null,
  titleStyle: null,
  isLoading: false,
};

const Button = ({ title, onPress, style: propStyle, titleStyle, isLoading }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={[style.container, propStyle]}
    onPress={onPress}
  >
    <View>
      <Text style={[style.title, titleStyle]}>{title}</Text>
    </View>
  </TouchableOpacity>
);

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
