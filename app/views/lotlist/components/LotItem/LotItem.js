// @flow

import { LotFieldProps, LotItemProps } from './types';

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import Locale from 'utils/locale';
import { pick } from 'ramda';

import colors from 'styles/colors';

import { StatusBadge, BarBadge } from 'components/custom/Lot/Badges';

import PaymentAccepted from 'components/custom/Lot/PaymentAccepted';
import CashReadyStatus from 'components/custom/Lot/CashReadyStatus';

import LotDistance from '../LotDistance';

import { getNextLocationFromLot } from 'utils/lotUtils';

const yesNoMap = {
  Y: 'Yes',
  N: 'No',
  U: 'Unknown',
};
const getValue = (key: string, value: any): string => {
  if (key === 'hasKeys') {
    return yesNoMap[value || 'U'];
  }
  return '';
};

const formatDueDate = (d: number) => moment(d).format('MM/DD/YYYY');

const LotField = ({ field, value, style }: LotFieldProps) => (
  <Text style={[styles.text, style]}>
    <Text style={styles.fieldKey}>{field}: </Text>
    <Text style={styles.fieldValue}>{value}</Text>
  </Text>
);

const Flag = () => (
  <Icon
    name={'bookmark'}
    size={35}
    color={colors.DARK_RED}
    style={{
      position: 'absolute',
      top: -13,
      right: -60,
      left: 250,
      zIndex: 999,
      backgroundColor: 'transparent',
      shadowColor: colors.LIGHT_RED,
      opacity: 0.96,
    }}
  />
);

const FlagBar = ({ paymentMode, cashStatus }) => (
  <View style={{ margin: 5, alignItems: 'flex-end' }}>
    {paymentMode === 'CASH' ? <CashReadyStatus
      mini
      cashStatus={cashStatus}
    /> : null}
    <PaymentAccepted mode={paymentMode} />
  </View>
);

const PartialVerifiedRow = ({ badge, comment }) => (
  <View
    style={{
      marginTop: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Text>{comment || Locale.translate('tab.Assigned.comment')}</Text>
    {badge && <StatusBadge status="partialTripConfirmed" />}
  </View>
);

const LotItem = ({
  lot,
  hasIssue,
  selected,
  multiselect,
  renderExtraView,
  showPartialVerified,
}: LotItemProps) => {
  const {
    number,
    description,
    isTowable,
    hasKeys,
    damageCode,
    trip_date: dueDate,
    lotStatus,
    tripType,
    paymentMode,
    cashStatus,
  } = lot;
  const location = getNextLocationFromLot(lot);
  const lotCoordinates = pick(['latitude', 'longitude'], location);
  return (
    <View style={styles.container}>
      {!hasIssue &&
        multiselect && (
          <View style={{ justifyContent: 'center' }}>
            <Icon
              size={22}
              name={selected ? 'check-square-o' : 'square-o'}
              color={selected ? colors.LIGHT_GREEN : 'black'}
              style={{ paddingRight: 5 }}
            />
          </View>
        )}
      <BarBadge status={lotStatus} />
      <View style={[styles.content, { marginLeft: multiselect ? 5 : 10 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {hasIssue ? <Flag /> : null}
          <Text style={styles.title}>
            {Locale.translate('tab.Assigned.LOT')}: {number}
          </Text>
        </View>
        <View style={{ flexWrap: 'wrap', maxWidth: 300 }}>
          <Text style={styles.subtitle}>{description}</Text>
          <Text style={styles.text}>
            {Locale.translate('tab.Assigned.Location')}: {location.city} |{' '}
            <Text style={styles.fieldKey}>
              <LotDistance
                lotCoordinates={lotCoordinates}
                style={styles.text}
              />
            </Text>
          </Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text
            style={[styles.text, { color: colors.DARK_RED, fontWeight: '500', paddingRight: 5 }]}
          >
            {Locale.translate('tab.Assigned.DUE')}: {dueDate ? formatDueDate(dueDate) : 'N/A'}
          </Text>
          <LotField
            style={{ paddingRight: 5 }}
            field="Towable"
            value={isTowable}
          />
          <LotField
            style={{ paddingRight: 5 }}
            field="Has Keys"
            value={getValue('hasKeys', hasKeys)}
          />
          <LotField
            field="Damage"
            value={damageCode}
          />
        </View>
        {renderExtraView ? renderExtraView(lot) : null}
        {lot.is_partial_trip_lot ? (
          <PartialVerifiedRow
            badge
            comment={lot.partial_trip_comments}
          />
        ) : null}
      </View>
      <View style={{ width: 40 }}>
        {tripType === 'P' ? <FlagBar
          paymentMode={paymentMode}
          cashStatus={cashStatus}
        /> : null}
      </View>
    </View>
  );
};

LotItem.defaultProps = {
  multiselect: false,
  selected: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 50,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  title: { fontSize: 16, paddingTop: 3, fontWeight: 'bold', color: colors.COPART_BLUE },
  subtitle: { fontSize: 15, paddingTop: 3, fontWeight: '500', color: colors.GRAY_DARK },
  text: { fontSize: 14, paddingTop: 3, color: colors.GRAY_DARK },
  fieldKey: { color: '#212121', fontWeight: '500' },
  fieldValue: { color: '#212121' },
  paymentInfo: { margin: 5, justifyContent: 'center' },
  paymentItem: { height: 16, width: 23, marginBottom: 3 },
});

export default LotItem;
