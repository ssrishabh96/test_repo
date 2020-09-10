import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

import { images } from 'constants/icons';

export default class Banner extends React.Component {
  // state = {
  //   visibility: new Animated.Value(0),
  // }

  // componentDidMount() {
  // Animated.timing(this.state.visibility, {
  //   toValue: 1,
  //   duration: 1400,
  // }).start();
  // }

  render() {
    const props = this.props;
    // const containerStyle = {
    //   opacity: this.state.visibility.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: [0, 1]
    //   }),
    //   transform: [
    //     {
    //       scale: this.state.visibility.interpolate({
    //         inputRange: [0, 1],
    //         outputRange: [1.1, 1],
    //       }),
    //     },
    //   ],
    // }
    return (
      <View
        style={[
          // containerStyle,
          {
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: props.isKeyboardOpen ? 120 : null,
          },
          props.style,
        ]}
      >
        <Image
          style={{
            width: props.imageWidth,
            height: props.imageHeight,
          }}
          source={images.copartLogoBanner}
        />
        {!props.isKeyboardOpen && (
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                flex: 1,
                borderRightWidth: 1,
                borderRightColor: 'white',
              }}
            />
            <Text
              style={{
                flex: 1,
                padding: 10,
                fontSize: 18,
                color: 'white',
              }}
            >
              Transporter
            </Text>
          </View>
        )}
      </View>
    );
  }
}
