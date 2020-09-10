import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { getFormattedDate } from 'utils/dateUtils';

import { defaultNavStyles } from 'styles';

import FullScreenLoader from 'components/custom/FullScreenLoader';
import LotInfoHeader from './components/ViewHeader/LotInfoHeader';

import { lotInfoSelector } from 'views/lotview/lotview.redux';

const getFormattedLocation = loc =>
  `${loc.line_1} ${loc.line_2}\n${loc.city}, ${loc.state}.\n${loc.zip}`;

const lotInfoFields = [
  { key: 'sellerName', label: 'Seller Name' },
  { key: 'adjusterName', label: 'Adjuster Name' },
  { key: 'adjusterNumber', label: 'Adjuster Phone Number' },
  { key: 'insuredName', label: 'Insured Name' },
  { key: 'ownerName', label: 'Owner Name' },
  { key: 'ownerNumber', label: 'Owner Phone Number' },
  { key: 'trip_date', label: 'Due Date', type: 'date' },
  { key: 'policyNumber', label: 'Policy Number' },
  { key: 'claimNumber', label: 'Claim Number' },
  { key: 'lossType', label: 'Loss Type' },
  { key: 'lossDate', label: 'Loss Date' },
];
const deliveryLotInfoFields = [
  { key: 'description', label: 'Vehicle Description' },
  { key: 'lossType', label: 'Damage Type' },
  { key: 'licenseNumber', label: 'License Number' },
  { key: 'vin', label: 'VIN' },
  { key: 'vehicleType', label: 'Vehicle Type' },
  { key: 'responsible_party_name', label: 'Driver Name (Tow Provider)' },
  { key: 'isTowable', label: 'Is Tow-able' },
  { key: 'source', label: 'Yard Address', type: 'address' },
  { key: 'destination', label: 'Delivery Address', type: 'address' },
  { key: 'tripZone', label: 'Trip Zone' },
  { key: 'vehicle_weight', label: 'Vehicle Weight' },
];
const pickupLotInfoFields = [
  { key: 'description', label: 'Vehicle Description' },
  { key: 'lossType', label: 'Damage Type' },
  { key: 'licenseNumber', label: 'License Number' },
  { key: 'vin', label: 'VIN' },
  { key: 'vehicleType', label: 'Vehicle Type' },
  { key: 'responsible_party_name', label: 'Driver Name (Tow Provider)' },
  { key: 'isTowable', label: 'Is Tow-able' },
  { key: 'source', label: 'Pickup Address', type: 'address' },
  { key: 'destination', label: 'Yard Address', type: 'address' },
  { key: 'tripZone', label: 'Trip Zone' },
  { key: 'advanceLimit', label: 'Advance Limit' },
  { key: 'vehicle_weight', label: 'Vehicle Weight' },
];
const extraFieldsMap = {
  P: pickupLotInfoFields,
  D: deliveryLotInfoFields,
};

const InfoRow = ({ label, key1, lot, type }) => (
  <View style={{ minHeight: 30, margin: 10, marginHorizontal: 20, flexDirection: 'row' }}>
    <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 16 }}>{label}</Text>
    <Text style={{ flex: 1, textAlign: 'right' }}>
      {(lot[key1] &&
        (type === 'date'
          ? getFormattedDate(lot[key1])
          : type === 'address' ? getFormattedLocation(lot[key1]) : lot[key1])) ||
        'N/A'}
    </Text>
  </View>
);

class LotInfo extends Component {
  static navigatorStyle = defaultNavStyles;
  static navigatorButtons = {
    leftButtons: [
      {
        id: 'cancel',
        title: 'Close',
      },
    ],
  };
  constructor(props) {
    super(props);
    const { navigator } = this.props; // eslint-disable-line
    navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.id === 'cancel') {
      this.props.navigator.dismissModal();
    }
  }
  render() {
    const { data, isLoading, hasError } = this.props.lotInfo;
    if (isLoading) {
      return <FullScreenLoader />;
    }
    const lot = hasError ? lot : data;
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <LotInfoHeader
          lotNumber={lot.number}
          lotDescription={lot.description}
          suffix={lot.suffix}
        />
        <FlatList
          data={[...lotInfoFields, ...extraFieldsMap[data.formType]]}
          renderItem={({ item }) => (
            <InfoRow
              label={item.label}
              lot={lot}
              key1={item.key}
              type={item.type}
            />
          )}
        />
      </View>
    );
  }
}

LotInfo.defaultProps = {
  lotInfo: {},
};

export default connect(lotInfoSelector)(LotInfo);
