import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TextInput,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import RoundButton from '../RoundButton';

import Locale from 'utils/locale';
import colors from 'styles/colors';

const Header = ({ onCancel, trip }) => (
  <View style={styles.header}>
    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>
      {`TRIP - ${trip.tripId} | ${trip.tripName}`}
    </Text>
    <TouchableOpacity onPress={onCancel}>
      <Text style={styles.button}>{Locale.translate('Cancel')}</Text>
    </TouchableOpacity>
  </View>
);

const OverrideDeclineModal = props => (
  <Modal
    transparent
    visible={props.isModalVisible}
    animationType="slide"
  >
    <View style={styles.container}>
      <Header
        onCancel={props.onPressCancel}
        trip={props.trip}
      />
      <View style={styles.innerContainer}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>
          {Locale.translate('declinedTripDetail.OverideRejectionNotes')}
        </Text>
        <TextInput
          style={{
            minHeight: 120,
            padding: 10,
            fontSize: 16,
            borderWidth: 1.0,
            borderColor: 'black',
            justifyContent: 'flex-start',
            color: 'black',
            marginBottom: 10,
          }}
          onChangeText={props.updateOverrideDeclineText}
          multiline
          numberOfLines={5}
          placeholder={Locale.translate('declinedTripDetail.OverideRejectionNotesRequired')}
          placeholderTextColor={colors.GRAY_DARK}
          underlineColorAndroid={'transparent'}
        />
        <RoundButton
          // style={{ flex: 0.5 }}
          onPress={props.onOverrideRejection}
          btnLabel={`${Locale.translate('declinedTripDetail.OverideRejectionButton')} ${
            props.trip && props.trip.vendorPersonnelId ? 'Driver' : 'Group'
          }`}
          btnColor={colors.COPART_BLUE}
        />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(10, 8, 10, 0.78)',
    marginTop: 64,
  },
  innerContainer: {
    padding: 20,
    backgroundColor: 'white',
    paddingBottom: 10,
    maxHeight: Math.floor(Dimensions.get('window').height),
  },
  header: {
    backgroundColor: colors.GRAY_DARK_1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  button: {
    marginRight: 10,
    color: colors.LIGHT_YELLOW,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OverrideDeclineModal;
