import React from 'react';
import { View, Text, Image } from 'react-native';
import icons from '../../../../constants/icons';
// import { pathOr } from 'ramda';

import Locale from 'utils/locale';

export default group => (
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
      {group.name}
    </Text>
    <View style={{ flexDirection: 'row', paddingBottom: 5 }}>
      <Text style={{ fontSize: 16 }}>{Locale.translate('profileItems.status.label')}</Text>
      <Text style={{ fontSize: 16, paddingLeft: 5, fontStyle: 'italic' }}>
        {group.status === 'A'
          ? Locale.translate('profileItems.status.Active')
          : Locale.translate('profileItems.status.Inactive')}
      </Text>
    </View>
    <View style={{ flexDirection: 'row', paddingBottom: 5 }}>
      <Text style={{ fontSize: 16 }}>{Locale.translate('profileItems.email.label')}</Text>
      <Text style={{ fontSize: 16, paddingLeft: 5, fontStyle: 'italic' }}>abc@copart.com</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }}>
      <Image
        source={icons.tripsScreen.tripIconLocationPin}
        style={{ marginRight: 5 }}
      />
      <View>
        <Text style={{ fontSize: 16, color: '#005abc' }}>123 ABC Street, Dallas, TX - 712312</Text>
      </View>
    </View>
    <View style={{ flexDirection: 'row', paddingBottom: 5 }}>
      <Text style={{ fontSize: 16 }}>{Locale.translate('profileItems.phone.label')}</Text>
      <Text style={{ fontSize: 16, paddingLeft: 5, fontStyle: 'italic' }}>(646) 431 2289</Text>
    </View>
  </View>
);
