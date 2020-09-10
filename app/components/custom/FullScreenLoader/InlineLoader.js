// @flow

import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const InlineLoader = ({ isLoading = false }: { isLoading: boolean }) => (
  <View style={{ justifyContent: 'center', margin: 5 }}>
    <ActivityIndicator
      animating={isLoading}
      size="small"
    />
  </View>
);

InlineLoader.defaultProps = {
  isLoading: true,
};

export default InlineLoader;
