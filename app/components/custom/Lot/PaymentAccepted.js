import React from 'react';
import { View, Image, Text } from 'react-native';
import PropTypes from 'prop-types';

import icons from 'constants/icons';

const paymentTypesIconMap = {
  card: icons.tripsScreen.tripIconCard,
  cash: icons.tripsScreen.tripIconCash,
  check: icons.tripsScreen.tripIconCheck,
};

const PaymentType = ({ mode, row }) => {
  if (mode) {
    if (mode.includes('/')) {
      const modes = mode.split('/');
      return (
        <View style={row ? { flexDirection: 'row' } : null}>
          {modes.map(m => (
            <Image
              style={{ margin: 2 }}
              source={paymentTypesIconMap[m.toLowerCase()]}
            />
          ))}
        </View>
      );
    }
    return (
      <View style={{ margin: 3 }}>
        <Image source={paymentTypesIconMap[mode.toLowerCase()]} />
      </View>
    );
  }
  return null;
};

PaymentType.propTypes = {
  mode: PropTypes.string.isRequired,
  row: PropTypes.bool,
};
PaymentType.defaultProps = {
  mode: null,
  row: false,
};

export default PaymentType;
