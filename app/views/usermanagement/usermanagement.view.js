import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { keys, prop, sortBy } from 'ramda';

import { driverSelector } from './drivercontainer/drivercontainer.redux';
import { getDrivers, setCurrentDriver } from './drivercontainer/drivercontainer.action';
import { groupsSelector } from './groupscontainer/groupscontainer.redux';
import { getGroups } from './groupscontainer/groupscontainer.action';
import { userManagementSelector } from './usermanagement.redux';
import { getVendorInfo } from './usermanagement.action';
import { driverProfileSelector } from 'views/driverprofile/driverprofile.redux';

import UserManagementTabBar from './components/UserManagementTabBar';
import ProfileMini from './components/ProfileMini';

import { defaultNavStyles, Container } from 'styles';
import { personnelDataMapper } from 'utils/mappers/userManagementMapper';

class UserManagement extends Component {
  static propTypes = {
    getDrivers: PropTypes.func.isRequired,
    getGroups: PropTypes.func.isRequired,
    getVendorInfo: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    vendor: PropTypes.object.isRequired, // eslint-disable-line
    groupData: PropTypes.array.isRequired, // eslint-disable-line
    navigator: PropTypes.object.isRequired, // eslint-disable-line
    navProps: PropTypes.object.isRequired, // eslint-disable-line
    driver: PropTypes.object.isRequired, // eslint-disable-line
    groupName: PropTypes.string.isRequired,
  };

  static navigatorStyle = defaultNavStyles;

  state = {
    index: 0,
    routes: [{ key: 'groups', title: 'Groups' }, { key: 'drivers', title: 'Drivers' }],
  };

  componentDidMount() {
    this.props.getVendorInfo();
    this.props.getGroups();
    this.props.getDrivers();
  }

  handleGroupItemPress = (dispatchGroupId) => {
    const { groupData } = this.props;
    if (groupData && keys(groupData).length > 0) {
      const group = groupData.find(g => g.dispatchGroupId === dispatchGroupId);
      let personnel = group && prop('personnel')(group);
      // let drivers = personnel.filter(p => p.role_id === 3);
      // drivers = personnelDataMapper(drivers);
      personnel = personnelDataMapper(personnel);
      if (group && keys(group).length > 0) {
        this.props.navigator.showModal({
          screen: 'CopartTransporter.GroupsDriversListView',
          title: group.name.toUpperCase(),
          passProps: {
            personnel: sortBy(prop('firstName'))(personnel),
          },
        });
      }
    }
  };

  handleDriverItemPress = (vendorPersonnelId) => {
    this.props.navigator.push({
      screen: 'CopartTransporter.DriverDetail',
      passProps: {
        driverId: vendorPersonnelId,
      },
    });
  };

  handleEditDriverProfile = (driverObj) => {
    this.props.navigator.showModal({
      screen: 'CopartTransporter.UpdateDriverProfile',
      passProps: {
        driver: driverObj,
        type: 'EditDriver',
      },
    });
  };

  handleEditPersonalProfile = () => {
    this.props.navigator.showModal({
      title: 'Profile',
      screen: 'CopartTransporter.UpdateDriverProfile',
      passProps: {
        driver: this.props.driver,
        type: 'UpdateProfile',
      },
    });
  };

  handleTabIndexChanged = (index) => {
    this.setState({ index });
  };

  render() {
    return (
      <Container>
        <ProfileMini
          isLoading={this.props.isLoading}
          vendor={this.props.vendor}
          user={this.props.driver}
          groupName={this.props.groupName}
          onEditVendorProfile={this.handleEditPersonalProfile}
        />
        <UserManagementTabBar
          navProps={this.state}
          navigator={this.props.navigator}
          onTabIndexChanged={this.handleTabIndexChanged}
          onGroupItemPress={this.handleGroupItemPress}
          onDriverItemPress={this.handleDriverItemPress}
          onEditDriverProfile={this.handleEditDriverProfile}
        />
      </Container>
    );
  }
}

const mapDispatchToProps = {
  getDrivers,
  getGroups,
  getVendorInfo,
  setCurrentDriver,
};

const mapStateToProps = state => ({
  ...groupsSelector(state),
  ...driverSelector(state),
  ...userManagementSelector(state),
  ...driverProfileSelector(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
