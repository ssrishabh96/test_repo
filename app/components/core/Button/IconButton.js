import React from 'react';
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native';

const IconStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    margin: 10,
  },
  icon: {
    width: 18,
    height: 18,
  },
});

const IconButton = ({ icon, onPress, styles, containerStyle }) => (
  <TouchableOpacity
    // style={[IconStyles.button]}
    onPress={onPress}
  >
    <View style={[IconStyles.button, containerStyle]}>
      <Image
        style={[IconStyles.icon, styles]}
        source={icon}
      />
    </View>
  </TouchableOpacity>
);

export default IconButton;
