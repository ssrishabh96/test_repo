import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, Text } from 'react-native';
import styles from './styles';
import vehicleTypesData from './vehicleTypes';

export default class LotHeaderInfo extends Component {
  static propTypes = {
    lot: PropTypes.object.isRequired, // eslint-disable-line
    vehicleType: PropTypes.string.isRequired,
  };
  static vehicleImagePlaceholder = null;

  getVehicleImagePlaceholder = (vehicleType = 'A') => {
    const vehiclePlaceholder = vehicleTypesData.vehicleTypes.find(
      // vehicleType[0] because some vehicleTypes have extended names: 'V - AUTOMOBILE'
      // Just the first character matters
      vehicle => vehicle && vehicle.code && vehicle.code[0] === vehicleType[0],
    );
    return (
      (vehiclePlaceholder && vehiclePlaceholder.imagePlaceholder) ||
      vehicleTypesData.vehicleTypes[1].imagePlaceholder
    );
  };

  render() {
    const { vehicleType, lot } = this.props;
    const description = lot.description && lot.description.split(' ');
    // color: needs its own key on lot?
    const color = (description && description[description.length - 1]) || 'N/A';
    return (
      <View style={styles.container}>
        <View
          style={{
            flexGrow: 2,
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
          }}
        >
          <View style={{ maxWidth: 250, flexWrap: 'wrap' }}>
            <Text
              style={{ color: 'rgb(84, 90, 99)', fontSize: 18, fontWeight: '600', marginBottom: 3 }}
            >
              {`${lot.year} ${lot.make} ${lot.model}`}
            </Text>
          </View>
          <Text style={{ color: 'rgb(84, 90, 99)', fontSize: 16, fontWeight: '200' }}>{color}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            resizeMode="center"
            source={this.getVehicleImagePlaceholder(vehicleType)}
          />
        </View>
      </View>
    );
  }
}
