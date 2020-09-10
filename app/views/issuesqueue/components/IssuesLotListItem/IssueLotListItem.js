// @flow

import { Props } from './types';

import React from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';

import AssignedTo from 'views/distributed/components/AssignedTo';

import Locale from 'utils/locale';
import colors from 'styles/colors';

const formatDueDate = (d: number) => moment(d).format('MM/DD/YYYY');

// TODO: Create FieldGroup component for label:value

const IssuesLotListItem = ({ lot, listType }: Props) => {
  const inactiveIssue = lot && lot.messageStatus && lot.messageStatus === 'I';

  const reportedAssignedLabel =
    listType === 'raised'
      ? Locale.translate('issues.Lotlist.assignedTo')
      : Locale.translate('issues.Lotlist.reportedBy');

  let assignedTo = Locale.translate('N/A');
  let reportedBy = Locale.translate('N/A');

  if (listType === 'raised') {
    const currentEntityNameArray = lot && lot.currentEntityName && lot.currentEntityName.split('-');
    assignedTo =
      currentEntityNameArray &&
      Array.isArray(currentEntityNameArray) &&
      currentEntityNameArray.length > 0 &&
      currentEntityNameArray[0];
    // currentEntityNameArray.map((s: string) => s.trim()).join(', ');
  } else {
    const createdByNamesArray = lot && lot.createdByName && lot.createdByName.split('-');
    reportedBy =
      createdByNamesArray &&
      Array.isArray(createdByNamesArray) &&
      createdByNamesArray.length > 0 &&
      createdByNamesArray[0];
    // createdByNamesArray[createdByNamesArray.length - 1];
  }

  const reportedAssignedValue = listType === 'raised' ? assignedTo : reportedBy;

  return (
    <View style={{ flexDirection: 'row' }}>
      {inactiveIssue && (
        <View
          style={{
            alignSelf: 'flex-start',
            height: 15,
            width: 15,
            borderRadius: 15 / 2,
            marginTop: 7,
            marginRight: 5,
            backgroundColor: colors.COPART_BLUE,
          }}
        />
      )}
      <View>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            {Locale.translate('issues.Lotlist.Lot')}
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginRight: 10,
              color: colors.COPART_BLUE,
              fontWeight: 'bold',
            }}
          >
            {lot.lotNumber}
          </Text>
          <Text style={{ fontSize: 16, marginRight: 10 }}>
            {lot.make} | {lot.model}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 5, flexWrap: 'wrap' }}>
          <Text style={{ color: colors.GRAY_DARK }}>
            {Locale.translate('issues.Lotlist.IssueType')}
          </Text>
          <Text style={{ fontWeight: 'bold' }}>
            {`${lot.messageTypeDescription || ''}`}{' '}
            {lot.messageSubtypeDescription && `(${lot.messageSubtypeDescription || ''})`}
          </Text>
          {/* <Image
          style={{ marginLeft: 5 }}
          source={icons.tripsScreen.tripIconCash}
        /> */}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
          <Text style={{ color: colors.GRAY_DARK }}>
            {Locale.translate('issues.Lotlist.Location')}
          </Text>
          {lot.locationAddressLine1 && (
            <Text style={{ fontWeight: 'bold' }}>{lot.locationAddressLine1} | </Text>
          )}
          <Text style={{ fontWeight: 'bold' }}>
            {lot.tripDistance} {Locale.translate('issues.Lotlist.distance')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <Text style={{ fontSize: 14, color: 'red', fontWeight: '500', paddingRight: 5 }}>
            {Locale.translate('issues.Lotlist.due')}{' '}
            {lot.dueTodayFlag
              ? Locale.translate('issues.Lotlist.dueToday')
              : lot.dueDate && formatDueDate(lot.dueDate)}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 3,
            }}
          >
            <Text style={{ fontSize: 14, color: colors.GRAY_DARK }}>
              {Locale.translate('issues.Lotlist.reported')}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
              {formatDueDate(lot.createdDate)}
            </Text>
          </View>
        </View>
        {/* <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <Text style={{ color: colors.GRAY_DARK }}>
            {Locale.translate('issues.Lotlist.reportedBy')}
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{lot.createdByName}</Text>
          </View>
        </View> */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: !inactiveIssue ? 5 : null,
            }}
          >
            <Text style={{ color: colors.GRAY_DARK }}>{reportedAssignedLabel}</Text>
            <Text style={{ fontWeight: 'bold' }}>{reportedAssignedValue || '-'}</Text>
          </View>

          {inactiveIssue && (
            <AssignedTo
              status={'resolved'}
              type={'lot'}
              containerStyle={{ paddingTop: 1 }}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default IssuesLotListItem;
