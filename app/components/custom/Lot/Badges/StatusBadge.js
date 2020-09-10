import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import colors, { badgeColorsByStatus } from 'styles/colors';
import { LOT_STATUSES } from 'constants/Lot';

const statusMap = {
  [LOT_STATUSES.AWAITING_VENDOR_ACKNOWLEDGEMENT]: 'ASSIGNED',
  [LOT_STATUSES.AWAITING_GROUP_ACKNOWLEDGEMENT]: 'ASSIGNED',
  [LOT_STATUSES.AWAITING_DRIVER_ACKNOWLEDGEMENT]: 'ASSIGNED',
  [LOT_STATUSES.AWAITING_IN_PROGRESS]: 'ACKNOWLEDGED',
  [LOT_STATUSES.AWAITING_FORM_SUBMISSION]: 'IN PROGRESS',
  [LOT_STATUSES.AWAITING_ARRIVAL]: 'IN TRANSIT',
  [LOT_STATUSES.AWAITING_CHECKIN]: 'COMPLETED',
  [LOT_STATUSES.AWAITING_TRIP_VERIFICATION]: 'COMPLETED',
  [LOT_STATUSES.COMPLETED]: 'COMPLETED',
  resolved: 'RESOLVED',
  partialTripConfirmed: 'PARTIAL',
};

const propTypes = {
  status: PropTypes.number.isRequired,
  hasIssue: PropTypes.boolean,
  style: TouchableOpacity.propTypes.style,
  onPress: PropTypes.func,
};

const defaultProps = {
  hasIssue: false,
  onPress: () => {},
  style: StyleSheet.create({}),
};

const StatusBadge = ({ status, hasIssue, style, onPress }) => (
  <TouchableOpacity
    onPress={() => (hasIssue ? onPress() : null)}
    disabled={!hasIssue || !onPress}
    style={[
      styles.container,
      style,
      hasIssue ? null : { backgroundColor: badgeColorsByStatus[status] },
    ]}
  >
    <Text style={styles.status}>{hasIssue ? 'ISSUE' : statusMap[status]}</Text>
    {hasIssue && (
      <Icon
        size={16}
        name={'external-link'}
        color={'white'}
        style={{ marginLeft: 7 }}
      />
    )}
  </TouchableOpacity>
);
StatusBadge.propTypes = propTypes;
StatusBadge.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    margin: 5,
    padding: 2,
    paddingHorizontal: 8,
    backgroundColor: colors.DARK_RED,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  status: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StatusBadge;
