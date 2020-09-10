import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import colors from 'styles/colors';

type props = {
  lot: { number: number, description: string, vin: string | number },
};
export default ({ lot: { number, vin, description } }: props) => (
  <View style={styles.container}>
    <Text style={styles.text}>Lot #{number}</Text>
    <Text style={styles.text}>VIN #{vin}</Text>
    <Text style={styles.text}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    // height: 50,
    backgroundColor: colors.OFF_WHITE,
    borderTopWidth: 1,
    borderTopColor: colors.GRAY_LIGHT,
  },
  text: {
    marginBottom: 3,
    fontSize: 10,
    color: colors.GRAY_DARK,
    fontWeight: 'bold',
  },
});
