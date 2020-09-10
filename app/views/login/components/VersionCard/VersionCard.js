import React, { Component } from 'react';
import { View, Text } from 'react-native';

const VersionCard = ({ version, buildNumber }) => (
  <View style={{ position: 'absolute', bottom: 0, right: 0, margin: 10 }}>
    <Text style={{ color: 'white', fontSize: 12 }}>v. {version}</Text>
  </View>
);
VersionCard.defaultProps = {
  version: '-',
  buildNumber: '-',
};

export default VersionCard;
