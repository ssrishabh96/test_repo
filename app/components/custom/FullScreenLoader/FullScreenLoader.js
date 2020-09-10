// @flow

import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const FullScreenLoader = ({ isLoading = false }: { isLoading: boolean }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator
      animating={isLoading}
      size="large"
    />
  </View>
);

FullScreenLoader.defaultProps = {
  isLoading: true,
};

export default FullScreenLoader;
