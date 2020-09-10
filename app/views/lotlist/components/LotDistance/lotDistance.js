import React, { Component } from 'react';
import { Text } from 'react-native';
import Locale from 'utils/locale';

type Props = {
  lotCoordinates: Array,
  style: Object,
};

export default class LotDistance extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      calculating: true,
      distance: 0,
    };
  }

  componentWillMount() {
    this.getCurrentLocation();
  }

  getCurrentLocation = () => {
    const { latitude: lat, longitude: lng } = this.props.lotCoordinates;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.calculateDistance(lat, lng, position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          this.setState({ distance: '-' });
          console.log('Location Provide - PERMISSION_DENIED');
        }
      },
    );
    this.setState({ calculating: false });
  };

  calculateDistance = (lotLat = 0, lotLng = 0, currentLat, currentLng) => {
    const radlat1 = Math.PI * lotLat / 180;
    const radlat2 = Math.PI * currentLat / 180;
    const theta = lotLng - currentLng;
    const radtheta = Math.PI * theta / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = parseFloat(dist * 60 * 1.1515).toFixed(2);
    this.setState({ distance: dist });
  };

  render() {
    return (
      <Text style={this.props.style}>
        {this.state.distance} {Locale.translate('lotItem.distance')}
      </Text>
    );
  }
}
