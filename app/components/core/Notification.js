// @flow

import React from 'react';
import { StyleSheet, View, SafeAreaView, Text, Dimensions, Platform } from 'react-native';

import IconButton from 'components/core/Button/IconButton';

import icons from 'constants/icons';
import colors from 'styles/colors';

const { width: screenWidth } = Dimensions.get('window');

type Props = {
  navigator: Object,
  content: ?string,
  type?: ?string,
};

const colorMapper = (type: ?string) => {
  switch (type) {
    case 'success':
      return colors.DARK_GREEN;
    case 'error':
      return colors.DARK_RED;
    case 'warning':
      return colors.LIGHT_BLUE;
    default:
      return colors.GRAY_LIGHT;
  }
};

const Notification = ({ navigator, content, type }: Props) => (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={[styles.container, { backgroundColor: colorMapper(type) }]}>
      <View style={styles.content}>
        <Text style={styles.contentInner}>{content}</Text>
      </View>
      <IconButton
        icon={icons.close}
        onPress={() => navigator.dismissInAppNotification()}
        styles={{ height: 25, width: 25 }}
        containerStyle={{
          margin: 0,
          marginLeft: 10,
          alignItems: 'flex-end',
        }}
      />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    minHeight: 100,
    width: screenWidth - 20,
    backgroundColor: '#999999',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        marginTop: 20,
      },
      android: {
        marginTop: 0,
        marginLeft: 10,
      },
    }),
  },
  title: {
    fontSize: 18,
    color: 'black',
  },
  content: {
    flex: 1,
    width: screenWidth - 50 - 20,
  },
  contentInner: {
    textAlign: 'center',
    color: 'black',
  },
});

Notification.defaultProps = {
  type: 'warning',
};

export default Notification;
