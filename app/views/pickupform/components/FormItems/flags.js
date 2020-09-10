import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

export const Required = () => <Text style={{ color: 'red', fontSize: 17 }}>*</Text>;

export const Warning = ({ onPress = () => {} }) => (
  <TouchableOpacity onPress={onPress}>
    <Icon
      size={22}
      name={'exclamation-triangle'}
      color={'red'}
      style={{ paddingRight: 5 }}
    />
  </TouchableOpacity>
);
Warning.propTypes = {
  onPress: PropTypes.func.isRequired,
};
