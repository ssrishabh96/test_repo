import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import colors from 'styles/colors';

export const Screen = ({ title, subtitle, image }) => (
  <View style={styles.background}>
    <View style={styles.titleWrapper}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
    <View style={styles.image}>
      <Image
        source={image}
        resizeMode="contain"
        style={styles.image}
      />
    </View>
  </View>
);
const styles = {
  background: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 10,
  },
  title: {
    color: colors.COPART_BLUE,
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.TEXT_DARK,
    fontSize: 16,
    textAlign: 'center',
  },
  image: { flex: 3, width: Dimensions.get('screen').width - 40, padding: 20 },
};
