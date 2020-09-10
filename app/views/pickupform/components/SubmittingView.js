import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from 'styles/colors';

export default ({ status = '' }) => (
  <View style={styles.container}>
    <View style={styles.indicator}>
      <ActivityIndicator
        animating
        color={colors.COPART_BLUE}
        size="large"
      />
    </View>
    <Text style={styles.text}>{status}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.OFF_WHITE,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  indicator: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  text: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.GRAY_DARK,
  },
});
