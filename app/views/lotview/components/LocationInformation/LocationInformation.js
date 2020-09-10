import { Lot } from 'types/Lot';

import React from 'react';
import { View, Text, TouchableOpacity, Linking, Platform, StyleSheet } from 'react-native';
import renderIf from 'render-if';
import { map, prop, __, compose, join } from 'ramda';

import PhoneNumber from '../PhoneNumber';

import Locale from 'utils/locale';
import { getNextLocationFromLot } from 'utils/lotUtils';

const locationToArray = (loc: Object) =>
  map(prop(__, loc))(['name', 'line_1', 'city', 'state', 'zip']);
const encodeLocation = compose(encodeURIComponent, join(' '), locationToArray);

const openMap = (location: Object) => {
  const address = encodeLocation(location);
  console.log({ address });
  const link = Platform.select({
    ios: `http://maps.apple.com/?q=${address}&z=15`,
    android: `http://maps.google.com/maps?q=${address}&z=15`,
  });
  Linking.openURL(link).catch(err => console.error('An error occured', '??', err));
};

const LocationInformation = ({ title, location, focuesed }) => {
  const renderIfHasAvailibility = renderIf('availibility' in location);
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.subtitle}>{title}</Text>
      <View style={styles.infoContainer}>
        <TouchableOpacity
          onPress={() => {
            openMap(location);
          }}
        >
          <View style={styles.addressContainer}>
            <Text style={[styles.link, styles.linkTitle]}>{location.name}</Text>
            <Text style={styles.link}>{location.line_1},</Text>
            <Text style={styles.link}>
              {location.city}, {location.state} - {location.zip}
            </Text>
          </View>
        </TouchableOpacity>
        {renderIfHasAvailibility(
          <View>
            <Text style={[styles.link, styles.linkTitle]}>
              {location.availibility && location.availibility.days}
            </Text>
            <Text style={styles.link}>{location.availibility && location.availibility.hours}</Text>
          </View>,
        )}
      </View>
    </View>
  );
};

const LocationContainer = ({ lot }: Lot) => {
  const location = getNextLocationFromLot(lot);
  return (
    <View>
      <Text style={styles.header}>{Locale.translate('lotView.location.information')}</Text>
      <View style={{ flexDirection: 'row' }}>
        <LocationInformation
          title="From"
          location={lot.source}
          focused
        />
        <LocationInformation
          title="To"
          location={lot.destination}
          focused={false}
        />
      </View>
      <PhoneNumber
        number={(lot && lot.location_phone_number) || ''}
        callable={(lot.location_phone_number && lot.location_phone_number.length === 10) || false}
      />
    </View>
  );
};

export default LocationContainer;

const styles = StyleSheet.create({
  header: { color: '#005abc', fontWeight: 'bold', fontSize: 14 },
  subtitle: { color: '#005abc', fontWeight: 'bold', fontSize: 12 },
  infoContainer: { paddingVertical: 5 },
  addressContainer: { marginRight: 50 },
  link: {
    color: 'rgb(84, 90, 99)',
    fontSize: 13,
    paddingBottom: 2,
    textDecorationLine: 'underline',
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: '600',
    paddingBottom: 5,
  },
});
