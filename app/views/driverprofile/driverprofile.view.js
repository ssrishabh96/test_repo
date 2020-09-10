// @flow

import type { Props } from './types';

import React, { Component } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import { driverProfileSelector } from './driverprofile.redux';

import DriverInfoItem from './components/DriverInfoItem';

import { defaultNavStyles } from 'styles';
import styles from './driverprofile.styles';
import { formatPhoneNumber } from 'utils';

class DriverProfile extends Component<Props> {
  static navigatorStyle = defaultNavStyles;

  handleEditDriverProfile = () => {
    this.props.navigator.showModal({
      screen: 'CopartTransporter.UpdateDriverProfile',
      passProps: {
        driver: this.props.driver,
        groupName: this.props.groupName,
        type: 'UpdateProfile',
      },
    });
  };

  render() {
    const { driver, groupName } = this.props;
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity
          onPress={this.handleEditDriverProfile}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#323742',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            right: 10,
            top: 5,
            zIndex: 999,
          }}
        >
          <Icon
            size={22}
            name={'pencil'}
            color={'#fff'}
          />
        </TouchableOpacity>

        <DriverInfoItem
          label="Name"
          value={`${driver.firstName} ${driver.middleName || ''} ${driver.lastName}`}
        />
        <DriverInfoItem
          label="Group"
          value={groupName || 'N/A'}
          // styles={{
          //   backgroundColor: colors.DARK_YELLOW,
          //   borderRadius: 10,
          //   padding: 4,
          //   height: 30,
          //   minWidth: 45,
          // }}
        />
        <DriverInfoItem
          label="Phone Number"
          value={driver.phoneNum && formatPhoneNumber(driver.phoneNum.toString())}
        />
        <DriverInfoItem
          label="Email"
          value={driver.email || 'N/A'}
        />
        <DriverInfoItem
          label="Dispatchable"
          value={driver.dispatchableFlag ? 'Yes' : 'No'}
        />
        <DriverInfoItem
          label="Pcard"
          value={driver.pcardFlg && driver.pcardFlg === 'Y' ? 'Yes' : 'No'}
        />
        <DriverInfoItem
          label="Start Date"
          value={moment(driver.startDate).format('YYYY-MM-DD')}
        />
      </ScrollView>
    );
  }
}

export default connect(driverProfileSelector)(DriverProfile);
