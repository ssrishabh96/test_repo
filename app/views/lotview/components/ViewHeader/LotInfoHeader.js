import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import colors from 'styles/colors';
import styles from './styles';

const LotInfoHeader = ({ lotNumber, lotDescription, suffix }) => (
  <View
    style={[
      styles.navbarHeading,
      {
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
    ]}
  >
    <Text style={{ color: '#fefefe', fontWeight: 'bold' }}>
      LOT #{lotNumber} - {suffix}
    </Text>
    <Text style={{ color: colors.LIGHT_YELLOW, fontWeight: 'bold' }}>{lotDescription}</Text>
  </View>
);

LotInfoHeader.defaultProps = {
  lotNumber: '-',
  lotDescription: '--',
  suffix: '',
};

LotInfoHeader.propTypes = {
  lotNumber: PropTypes.number,
  lotDescription: PropTypes.string,
  suffix: PropTypes.string,
};

export default LotInfoHeader;
