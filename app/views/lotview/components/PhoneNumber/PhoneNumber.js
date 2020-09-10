import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import Communications from 'react-native-communications';

import { formatPhoneNumber } from 'utils';
import icons from 'constants/icons';
import colors from 'styles/colors';

type P = {
  number?: string,
  callable?: boolean,
};

const PhoneNumber = ({ number, callable }: P) => (
  <TouchableOpacity
    onPress={() => callable && Communications.phonecall(number, true)}
    disabled={!callable}
  >
    <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
      <Image
        source={icons.tripsScreen.tripIconPhone}
        style={{
          marginRight: 5,
          tintColor: callable ? colors.COPART_BLUE : colors.GRAY_1,
        }}
      />
      <Text
        style={{
          fontSize: 14,
          color: callable ? colors.COPART_BLUE : colors.GRAY_1,
          fontWeight: '800',
        }}
      >
        {(number && formatPhoneNumber(number)) || 'N/A'}
      </Text>
    </View>
  </TouchableOpacity>
);

PhoneNumber.defaultProps = {
  number: '',
  callable: false,
};

export default PhoneNumber;
