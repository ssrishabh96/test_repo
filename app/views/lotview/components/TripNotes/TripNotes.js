// @flow
import type { Lot } from 'types/Lot';

import React from 'react';
import { pathOr } from 'ramda';
import { View, Text, TouchableOpacity } from 'react-native';
import renderIf from 'render-if';
import { Navigation } from 'react-native-navigation';

import InlineLoader from 'components/custom/FullScreenLoader/InlineLoader';
import { getLotTripTypeInfo } from 'constants/tripTypeMap';
import { getNextLocationFromLot } from 'utils/lotUtils';

const emptyNotesText = 'No notes on this lot';

type NotesMiniProps = {
  title: string,
  locationNotes: string,
  directions: string,
};
const NotesMini = ({ title, locationNotes, directions }: NotesMiniProps) => {
  const renderIfNotesLong = renderIf(locationNotes.length > 80 || directions.length > 80);
  return (
    <View style={{ paddingVertical: 5, paddingRight: 0 }}>
      <Text style={{ color: 'rgb(84, 90, 99)', fontSize: 13, fontWeight: '600' }}>
        {'Location Notes:'}
      </Text>
      <Text style={{ color: 'grey', paddingLeft: 5 }}>{locationNotes.substring(0, 80)}</Text>
      <Text style={{ color: 'rgb(84, 90, 99)', fontSize: 13, fontWeight: '600' }}>
        {'Directions Notes:'}
      </Text>
      <Text style={{ color: 'grey', paddingLeft: 5 }}>{directions.substring(0, 80)}</Text>
      {renderIfNotesLong(
        <TouchableOpacity
          onPress={() => {
            Navigation.showModal({
              screen: 'CopartTransporter.PickupNotes',
              title,
              passProps: {
                notes: [
                  { title: 'Location Notes', note: locationNotes },
                  { title: 'Direction Notes', note: directions },
                ],
              },
              animationType: 'slide-up',
            });
          }}
        >
          <Text style={{ color: '#005abc', fontSize: 14, fontWeight: 'bold', paddingTop: 5 }}>
            ...Read More
          </Text>
        </TouchableOpacity>,
      )}
    </View>
  );
};

const getPickupNotes = pathOr(emptyNotesText, ['data', 'pickup_notes']);
const getDirectionsNotes = pathOr(emptyNotesText, ['data', 'directions']);

type TripNotesProps = {
  lot: Lot,
  lotInfo: Lot,
};

const TripNotes = ({ lot, lotInfo }: TripNotesProps) => {
  const notes = getPickupNotes(lotInfo).trim();
  const location = getNextLocationFromLot(lotInfo);
  const directions = getDirectionsNotes(lotInfo).trim();
  const title = getLotTripTypeInfo(lot).tripNotesHeading.toUpperCase();
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ color: '#005abc', fontWeight: 'bold', fontSize: 14 }}>{title}</Text>
      {lotInfo.isLoading ? (
        <InlineLoader />
      ) : (
        <NotesMini
          title={title}
          locationNotes={notes}
          directions={directions}
        />
      )}
    </View>
  );
};

export default TripNotes;
