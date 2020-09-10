import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
  message: string,
  style?: Object,
  textStyle?: Object,
  icon?: React.Node,
};
const Banner = ({ message, style, textStyle, icon }: Props) => (
  <View style={[styles.banner, style]}>
    {icon}
    <Text style={[styles.text, textStyle]}>{message}</Text>
  </View>
);

Banner.defaultProps = {
  style: {},
  textStyle: {},
  icon: null,
};

const styles = StyleSheet.create({
  banner: {
    // height: 24,
    paddingVertical: 3,
    paddingHorizontal: 5,
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomColor: '#0005',
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 14,
    color: '#fff',
    paddingLeft: 5,
  },
});
export default Banner;

export const OfflineBanner = () => (
  <Banner
    style={offlineStyles.banner}
    message={'You are currently offline'}
    icon={
      <Icon
        name={'exclamation-circle'}
        color={'white'}
        size={16}
        style={{
          marginTop: 2,
        }}
      />
    }
  />
);
const offlineStyles = StyleSheet.create({
  banner: {
    backgroundColor: '#E33',
  },
  icon: {
    height: 15,
    marginTop: 2,
    resizeMode: 'contain',
  },
});
