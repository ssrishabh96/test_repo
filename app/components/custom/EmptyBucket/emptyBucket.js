// @flow

import type { RNNNavigator, RNNNavigatorEvent } from 'types/RNNavigation';

import React from 'react';
import { View, Image, Text } from 'react-native';
import colors from 'styles/colors';

import EmptyListTypes from './typeMap';

type Props = {
  type: string,
  navigator: RNNNavigator,
};

class EmptyBucket extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    if (this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
  }
  onNavigatorEvent(event: RNNNavigatorEvent) {
    if (event.id === 'cancel') this.props.navigator.dismissModal();
    if (event.id === 'back') this.props.navigator.pop();
  }
  render() {
    const { type = 'defaultType' } = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.OFF_WHITE,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            height: 400,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image source={EmptyListTypes[type].image} />
          <Text
            style={{ fontSize: 18, fontWeight: 'bold', color: colors.TEXT_DARK, paddingTop: 18 }}
          >
            {EmptyListTypes[type].title}
          </Text>
          <Text
            style={{ fontSize: 18, color: colors.TEXT_DARK, paddingTop: 18, textAlign: 'center' }}
          >
            {EmptyListTypes[type].subtitle}
          </Text>
        </View>
      </View>
    );
  }
}
export default EmptyBucket;
