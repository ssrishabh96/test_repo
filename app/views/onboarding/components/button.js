import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

export const Button = ({ onPress, text, style = {} }) => (
  <TouchableHighlight
    onPress={onPress}
    underlayColor="#eee"
    style={styles.button}
  >
    <Text style={[styles.text, style]}>{text}</Text>
  </TouchableHighlight>
);
const styles = {
  button: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: '#bbb',
    fontWeight: 'bold',
  },
};
