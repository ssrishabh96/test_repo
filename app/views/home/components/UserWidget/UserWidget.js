import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import PropTypes from 'prop-types';
import IconButton from 'components/core/Button/IconButton';
import icons, { images } from 'constants/icons';
import colors from 'styles/colors';
import UserVehiclePicker from 'views/settings/components/UserVehicle/UserVehiclePicker';
import userVehicleData from 'views/settings/components/UserVehicle/userVehicleData';
import Locale from 'utils/locale';

const Banner = () => (
  // <Image
  //   style={{
  //     width: 90,
  //     height: 90,
  //     borderRadius: 90 / 2,
  //   }}
  //   source={require('../../../../images/Copart.png')}
  // />
  <Image
    style={{
      marginTop: 20,
      width: 140,
      height: 52,
    }}
    source={images.transporterBanner}
  />
);

const Avatar = ({ firstName = '', lastName = '' }) => (
  <View
    style={{
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#323742',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      right: 90,
      top: -10,
      zIndex: 999,
      opacity: 0.9,
    }}
  >
    <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>{firstName[0]}</Text>
    <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>{lastName[0]}</Text>
  </View>
);

const getPersonnelData = pathOr({}, ['personnel_data']);
class UserWidget extends Component {
  onChangeCurrentVehicle = (label) => {
    this.props.changeCurrentVehicle(label);
  };

  render() {
    const { activeVendor, handleSettingsPress } = this.props;
    return (
      <View style={{ padding: 16, flexDirection: 'row', height: 122, backgroundColor: 'white' }}>
        <Banner />
        <View style={{ marginLeft: 20, marginTop: 6, flex: 1 }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, marginLeft: 10, marginTop: 8 }}>
              {/* <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.GRAY_1 }}> */}
              <Avatar
                firstName={getPersonnelData(activeVendor).first_name}
                lastName={getPersonnelData(activeVendor).last_name}
              />
              {/* </Text> */}
              {/* <Text style={{ color: colors.GRAY_1 }}>{activeVendor.vendor_name}</Text> */}
            </View>
            <IconButton
              icon={icons.iconSettings}
              onPress={handleSettingsPress}
              styles={{ height: 30, width: 30 }}
              containerStyle={{
                margin: 5,
              }}
            />
          </View>
          <UserVehiclePicker
            mode="dropdown"
            selectedValue={this.props.currentVehicle}
            onValueChange={this.onChangeCurrentVehicle}
            style={{ width: 185 }}
          >
            {userVehicleData.vehicleType.map((data, index) => (
              <UserVehiclePicker.Item
                key={index}
                label={Locale.translate(data.localizedString)}
                value={Locale.translate(data.localizedString)}
              />
            ))}
          </UserVehiclePicker>
        </View>
      </View>
    );
  }
}

UserWidget.defaultProps = {
  activeVendor: { personnel_data: {} },
};

UserWidget.propTypes = {
  username: PropTypes.string.isRequired,
  handleSettingsPress: PropTypes.func.isRequired,
  currentVehicle: PropTypes.string.isRequired,
  changeCurrentVehicle: PropTypes.func.isRequired,
};

export default UserWidget;
