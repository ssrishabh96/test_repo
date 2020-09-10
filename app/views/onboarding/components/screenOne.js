import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import Logo from 'assets/images/banner-transporter.jpg';

export const ScreenOne = () => (
  <View style={styles.background}>
    <Image
      style={styles.image}
      source={Logo}
      resizeMode="contain"
    />
    <Text style={styles.title}>Welcome!</Text>
  </View>
);
const styles = {
  background: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  title: {
    flex: 1,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    padding: 20,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    width: Dimensions.get('screen').width - 40,
    padding: 20,
  },
};
