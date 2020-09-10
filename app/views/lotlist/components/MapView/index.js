// @flow
import { Props, State, MarkerType } from './types';
import { LotItemType } from '../LotItem/types';

import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import colors from 'styles/colors';
import icons from 'constants/icons';
import { pluck, compose, sum, head, pathOr, groupBy, propOr } from 'ramda';

import styles from './styles';

import { getNextLocationFromLot } from 'utils/lotUtils';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 70;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class MapContainer extends Component<Props, State> {
  static navigatorStyle = {
    navBarTextColor: '#fff',
    navBarBackgroundColor: colors.COPART_BLUE,
    navBarButtonColor: '#fff',
    navBarTitleTextCentered: true,
    navBarButtonFontSize: 10,
  };

  state = {
    initialRegion: {
      latitude: 32.7422329,
      longitude: -96.9529093,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    markers: [],
  };

  componentWillMount() {
    const { lots } = this.props;
    const grouplotsByLocation = groupBy(compose(propOr('', 'id'), getNextLocationFromLot));
    const lotsByLocation = grouplotsByLocation(lots);
    const markers = Object.keys(lotsByLocation).map((key: string) => {
      const list = lotsByLocation[key];
      const lot = head(list);

      const location = getNextLocationFromLot(lot);
      const latInRadians = location.latitude * (Math.PI / 180);
      const lngInRadians = location.longitude * (Math.PI / 180);
      if (list.length > 1) {
        return {
          key,
          type: 'cluster',
          count: list.length,
          lots: list,
          city: location.city || 'N/A',
          street: location.street || 'N/A',
          coordinate: {
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
          },
        };
      }
      return {
        key,
        number: lot.number.toString(),
        description: lot.description,
        city: location.city || 'N/A',
        street: location.street || 'N/A',
        coordinate: {
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
        },
        cartesianCoordinates: {
          axisX: Math.cos(latInRadians) * Math.cos(lngInRadians),
          axisY: Math.cos(latInRadians) * Math.sin(lngInRadians),
          axisZ: Math.sin(latInRadians),
        },
      };
    });
    // if (markers.length > 1) {
    //   this.calculateCentralCoordinates(markers);
    // } else {
    const lotCoordinates = head(markers);
    this.setState({
      initialRegion: {
        latitude: pathOr(0, ['coordinate', 'latitude'], lotCoordinates),
        longitude: pathOr(0, ['coordinate', 'longitude'], lotCoordinates),
        latitudeDelta: 30,
        longitudeDelta: 30 * ASPECT_RATIO,
      },
      markers,
    });
    // }
  }

  getMarkerTitle = (marker: MarkerType) =>
    marker.type === 'cluster' ? `${marker.count} Lots` : `LOT: ${marker.number}`;
  getMarkerDescription = (marker: MarkerType) =>
    marker.type === 'cluster'
      ? `City: ${marker.city}\nStreet: ${marker.street}`
      : `Description: ${marker.description}\nCity: ${marker.city}\nStreet: ${marker.street}`;

  calculateCentralCoordinates = (markers: MarkerType) => {
    const axisX = compose(pluck('axisX'), pluck('cartesianCoordinates'))(markers);
    const axisY = compose(pluck('axisY'), pluck('cartesianCoordinates'))(markers);
    const axisZ = compose(pluck('axisZ'), pluck('cartesianCoordinates'))(markers);
    const averageAxisX = sum(axisX) / axisX.length;
    const averageAxisY = sum(axisY) / axisY.length;
    const averageAxisZ = sum(axisZ) / axisZ.length;
    const centalSquareroot = Math.sqrt(averageAxisX * averageAxisX + averageAxisY * averageAxisY);
    const coordinates = {
      centalLongitude: Math.atan2(averageAxisY, averageAxisX),
      centalLatitude: Math.atan2(averageAxisZ, centalSquareroot),
    };
    this.setState({
      initialRegion: {
        ...this.state.initialRegion,
        latitude: coordinates.centalLatitude * 180 / Math.PI,
        longitude: coordinates.centalLongitude * 180 / Math.PI,
      },
      markers,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={this.state.initialRegion}
        >
          {this.state.markers.map((marker: MarkerType) => (
            <MapView.Marker
              key={marker.key}
              coordinate={marker.coordinate}
              title={this.getMarkerTitle(marker)}
              description={this.getMarkerDescription(marker)}
              image={icons.navIconInTransitActive}
            />
          ))}
        </MapView>
      </View>
    );
  }
}
