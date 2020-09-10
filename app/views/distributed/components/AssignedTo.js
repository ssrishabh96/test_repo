import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { StatusBadge } from 'components/custom/Lot/Badges';
import renderDisabledIssueIcon from './DisabledIssueIcon';

import Locale from 'utils/locale';
import colors from 'styles/colors';

type Props = {
  +status: string,
  +name: string,
  +type: 'lot' | 'trip',
  // +multiselect: Object,
  // +disabled: boolean,
  +isAssignedAsDriver: boolean,
  +hasLotWithIssue: boolean,
  +itemNotDistributable: boolean,
  +groupDoesNotMatchSelected: boolean,
  +action: string,
  containerStyle?: Object,
};

const AssignedTo = ({
  status,
  name,
  type,
  // multiselect,
  action,
  isAssignedAsDriver,
  hasLotWithIssue,
  itemNotDistributable,
  groupDoesNotMatchSelected,
  // disabled,
  containerStyle,
}: Props) => (
  <View style={[styles.container, styles[type], containerStyle]}>
    <View style={styles.labelContainer}>
      {action === 'distribute' &&
        renderDisabledIssueIcon({
          isAssignedAsDriver,
          hasLotWithIssue,
          itemNotDistributable,
          groupDoesNotMatchSelected,
        })}
      <Text style={styles.label}>{Locale.translate('distributed.assignedTo')}</Text>
      <Text style={styles.assignee}>{name}</Text>
    </View>
    <StatusBadge status={status} />
  </View>
);

AssignedTo.defaultProps = {
  containerStyle: {},
};

export default AssignedTo;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 14,
  },
  assignee: {
    flexWrap: 'wrap',
    marginLeft: 5,
    fontWeight: 'bold',
    color: colors.COPART_BLUE,
    fontSize: 14,
  },
  lot: { paddingLeft: 5, paddingTop: 5 },
});
