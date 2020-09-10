import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import colors from 'styles/colors';
import locale from 'utils/locale';

export default () => (
  <View style={styles.header}>
    <Text style={styles.title}>{locale.translate('setting.Terms')}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.GRAY_DARK_1,
    height: 44,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
