import React from 'react';
import { View, Text } from 'react-native';

const ErrorBox = (props) => {
  if (props.message) {
    return (
      <View style={{ padding: 10, backgroundColor: '#f44242' }}>
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          {props.message}
        </Text>
      </View>
    );
  }
};

export default ErrorBox;
