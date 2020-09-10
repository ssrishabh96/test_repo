import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import colors, { badgeColorsByStatus } from 'styles/colors';

const propTypes = {
  status: PropTypes.number.isRequired,
};

const BarBadge = ({ status }) => (
  <View
    style={{
      flex: 1,
      maxWidth: 4,
      borderRadius: 4,
      backgroundColor: badgeColorsByStatus[status] || colors.DARK_RED,
    }}
  />
);

BarBadge.propTypes = propTypes;

export default BarBadge;
