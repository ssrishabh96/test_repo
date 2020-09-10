import React from 'react';
import { View, StyleSheet } from 'react-native';
import FullScreenLoader from '../FullScreenLoader';

export default () => (
  <View style={styles.style}>
    <FullScreenLoader />
  </View>
);

const styles = StyleSheet.create({
  style: { padding: 10, height: 50 },
});
