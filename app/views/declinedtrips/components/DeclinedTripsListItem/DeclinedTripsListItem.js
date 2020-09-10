// @flow

import type { Trip } from 'types/Trip';

import React from 'react';
import { View, Text } from 'react-native';

import colors from 'styles/colors';
import Locale from 'utils/locale';
// import { getPropNameForLbl } from 'utils/commonUtils';

// TODO: Add proper type (extra attributes) for DeclinedTripItem
type Props = {
  trip: Trip,
  listType: 'assigned' | 'raised',
  role: number,
};

const DeclinedTripsListItem = ({ trip, listType, role }: Props) => {
  const reportedAssignedLabel =
    listType === 'raised'
      ? Locale.translate('issues.Lotlist.assignedTo')
      : Locale.translate('issues.Lotlist.reportedBy');
  let assignedTo = Locale.translate('N/A'); // TODO: Use this instead of trip.responsiblePartyName
  let reportedBy = Locale.translate('N/A');

  const lot = trip.lots[0] || null;
  const vendorPathFlag = parseInt(lot.vendor_path_flag, 10);
  const dispatchGroupPathFlag = parseInt(lot.dispatch_group_path_flag, 10);
  // const vendorPersonnelPathFlag = parseInt(lot.vendor_personnel_path_flag, 10);
  const responsiblePartyNameArray = trip.responsiblePartyName.split('-');

  let reportedAssignedValue = Locale.translate('N/A');
  if (listType === 'raised') {
    assignedTo = Locale.translate('N/A');
    if (dispatchGroupPathFlag === 1) {
      assignedTo = responsiblePartyNameArray[1] || Locale.translate('N/A');
    } else if (vendorPathFlag === 1) {
      assignedTo = responsiblePartyNameArray[0] || Locale.translate('N/A');
    }
    if (role === 1) assignedTo = 'Dispatcher';
  } else {
    reportedBy =
      responsiblePartyNameArray[responsiblePartyNameArray.length - 1] || Locale.translate('N/A');
  }
  reportedAssignedValue =
    (listType === 'raised' ? assignedTo : reportedBy) || trip.responsiblePartyName;
  // getPropNameForLbl(trip, listType, 'responsiblePartyName');

  const tripRejectionReason =
    trip.rejectionReason.substring(0, 5) === 'Other' ? 'Other' : trip.rejectionReason;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            {Locale.translate('declinedTrips.Trip')}
          </Text>
          <Text
            style={{ fontSize: 16, marginRight: 10, color: colors.COPART_BLUE, fontWeight: 'bold' }}
          >
            {trip.tripId} | {trip.tripName}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5,
            maxWidth: 300 /* , maxWidth: (SCREEN_WIDTH - 20), flexWrap: 'wrap' */,
          }}
        >
          <Text style={{ color: colors.GRAY_DARK }}>
            {Locale.translate('declinedTrips.RejectionReason')}
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>
              {tripRejectionReason || Locale.translate('N/A')}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <Text style={{ color: colors.GRAY_DARK }}>{reportedAssignedLabel}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{reportedAssignedValue}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DeclinedTripsListItem;
