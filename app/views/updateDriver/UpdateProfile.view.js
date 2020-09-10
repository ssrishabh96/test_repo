import React from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { equals, pathOr } from 'ramda';

import { updateDriver } from 'views/usermanagement/drivercontainer/drivercontainer.action';
import ViewBanner from 'views/usermanagementform/components/ViewBanner';
import UpdateProfileForm from './UpdateProfileForm';
import { updateDriverProfile } from 'views/driverprofile/driverprofile.action';

import Locale from 'utils/locale';
import { defaultNavStyles } from 'styles';
import colors from 'styles/colors';
import icons from 'constants/icons';

type Props = {
  navigator: Object,
  type: 'UpdateProfile' | 'EditDriver',
  driver: Object,
  groupName: string,
  updateDriverProfile: () => any,
  updateDriver: () => any,
};
class UpdateDriverView extends React.Component<Props> {
  static navigatorStyle = defaultNavStyles;
  static navigatorButtons = {
    leftButtons: [
      {
        icon: icons.tripsScreen.tripIconClose,
        id: 'closeModal',
      },
    ],
  };
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  onNavigatorEvent = (event) => {
    if (event.id === 'closeModal') {
      this.props.navigator.dismissModal();
    }
  };
  onSubmit = (values) => {
    const driverDetails = {
      firstName: pathOr('', ['driver', 'firstName'], this.props),
      middleName: pathOr('', ['driver', 'middleName'], this.props),
      lastName: pathOr('', ['driver', 'lastName'], this.props),
      phoneNum: pathOr('', ['driver', 'phoneNum'], this.props),
    };
    let driverToUpdate = {
      firstName: pathOr('', ['driverFName'], values),
      middleName: pathOr('', ['driverMName'], values),
      lastName: pathOr('', ['driverLName'], values),
      phoneNum: pathOr('', ['driverContactNumber'], values),
    };
    if (!equals(driverDetails, driverToUpdate)) {
      if (this.props.type === 'UpdateProfile') {
        // updating self
        this.props.updateDriverProfile(
          this.props.driver.vendorId,
          this.props.driver.vendorPersonnelId,
          driverToUpdate,
          this.props.navigator,
        );
      } else {
        // updating someone else
        driverToUpdate = { ...this.props.driver, ...driverToUpdate };
        this.props.updateDriver(driverToUpdate, this.props.navigator);
      }
    } else {
      this.props.navigator.dismissModal();
    }
  };
  getDriverInitialValues = () => {
    const driverFormInitialValue = {
      driverFName: this.props.driver.firstName,
      driverMName: this.props.driver.middleName || null,
      driverLName: this.props.driver.lastName,
      driverContactNumber: this.props.driver.phoneNum,
    };
    return driverFormInitialValue;
  };
  getHeaderTitle = () =>
    this.props.type === 'UpdateProfile'
      ? Locale.translate('userManagement.driverForm.bannerTitle.updateDriverProfile')
      : Locale.translate('userManagement.driverForm.bannerTitle.editForm');
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.WHITE }}>
        <ViewBanner headerTitle={this.getHeaderTitle()} />
        <ScrollView>
          <UpdateProfileForm
            type={this.props.type}
            user={this.props.driver}
            groupName={this.props.groupName}
            onSubmit={this.onSubmit}
            initialValues={this.getDriverInitialValues()}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = {
  updateDriver,
  updateDriverProfile,
};
export default connect(() => ({}), mapDispatchToProps)(UpdateDriverView);
