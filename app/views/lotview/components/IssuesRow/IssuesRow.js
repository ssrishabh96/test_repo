import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import colors from 'styles/colors';

const IssuesRow = props => (
  <TouchableOpacity
    style={{
      marginVertical: 10,
      backgroundColor: colors.DARK_RED,
      height: 55,
      padding: 10,
      justifyContent: 'center',
    }}
    onPress={props.onIssueRowPress}
  >
    <View>
      <Text style={{ color: '#fff' }}>Hi There From Issues Row!</Text>
    </View>
  </TouchableOpacity>
);

export default IssuesRow;
