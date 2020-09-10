import React from 'react';
import { View, Text } from 'react-native';
import { formatPhoneNumber } from 'utils';

import Locale from 'utils/locale';

export default (driver) => {
  const pcard = driver.pcard;
  return (
    <View
      style={{
        flex: 1,
        minHeight: 50,
        padding: 10,
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e5e8',
      }}
    >
      <Text style={{ fontWeight: 'bold', fontSize: 18, paddingBottom: 5, color: '#005abc' }}>
        {driver.firstName} {driver.lastName}
      </Text>
      <View style={{ flexDirection: 'row', paddingBottom: 5 }}>
        <Text style={{ fontSize: 16 }}>{Locale.translate('profileItems.email')}</Text>
        <Text style={{ fontSize: 16, paddingLeft: 5, fontStyle: 'italic' }}>{driver.email}</Text>
      </View>
      <View style={{ flexDirection: 'row', paddingBottom: 5 }}>
        <Text style={{ fontSize: 16 }}>{Locale.translate('profileItems.phone')}</Text>
        <Text style={{ fontSize: 16, paddingLeft: 5, fontStyle: 'italic' }}>
          {formatPhoneNumber(driver.phoneNum)}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          {Locale.translate('profileItems.pcard')}
        </Text>
        <View
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            backgroundColor: pcard && pcard.status ? '#737477' : '#4dc635',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
            {(pcard && pcard.status) || Locale.translate('N/A')}
          </Text>
        </View>
      </View>
    </View>
  );
};
