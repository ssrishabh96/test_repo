import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import colors from '../../styles/colors';

const style = StyleSheet.create({
  container: {
    height: 55,
    borderRadius: 6,
    backgroundColor: colors.COPART_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledContainer: {
    height: 55,
    borderRadius: 6,
    backgroundColor: colors.DISABLED,
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
  disabled: PropTypes.bool,
};

const defaultProps = {
  style: null,
  titleStyle: null,
  isLoading: false,
  disabled: false,
};

const Button = props => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => !props.isLoading && !props.disabled && props.onPress()}
  >
    <View style={[props.disabled ? style.disabledContainer : style.container, props.style]}>
      {props.isLoading ? (
        <ActivityIndicator
          animating={props.isLoading}
          size="large"
        />
      ) : (
        <Text style={[style.title, props.titleStyle]}>{props.title}</Text>
      )}
    </View>
  </TouchableOpacity>
);

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
