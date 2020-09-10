import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import styles from '../styles';
import Locale from 'utils/locale';

import { defaultNavStyles } from 'styles';
import colors from 'styles/colors';

type Props = {
  totalCount: number,
  resetFilter: () => any,
  handleOnApply: () => any,
  closeFilters: () => any,
  bucket: string,
};
const titleMap = {
  assigned: 'home.Assigned',
  assignedTrips: 'tab.Assigned.LotList',
  accepted: 'home.Acknowledged',
  acceptedTrips: 'tab.Acknowledged.AcknowledgeLotsTitle',
  inProgress: 'home.InProgress',
  inTransit: 'home.InTransit',
};
export default ({ totalCount, resetFilter, handleOnApply, closeFilters, bucket }: Props) => (
  <View>
    <View style={styles.navbar}>
      <TouchableOpacity onPress={closeFilters}>
        <Text style={styles.navbarButton}>{Locale.translate('filter.close')}</Text>
      </TouchableOpacity>
      <Text style={styles.navbarTitle}>{Locale.translate(titleMap[bucket])}</Text>
      <TouchableOpacity onPress={handleOnApply}>
        <Text style={styles.navbarButton}>{Locale.translate('filter.apply')}</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.headerView}>
      <Text style={styles.headerText}>
        {totalCount} {Locale.translate('filter.selected')}
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={resetFilter}>
          <Text style={styles.buttonText}>{Locale.translate('filter.reset')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
