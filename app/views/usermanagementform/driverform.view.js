import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addDriver } from 'views/usermanagement/drivercontainer/drivercontainer.action';
import { groupsSelector } from '../usermanagement/groupscontainer/groupscontainer.redux';
import { fetchCountriesList, fetchStatesList } from './usermanagementform.action';
import { userManagementRootSelector } from './usermanagementform.redux';

import { defaultNavStyles } from 'styles';
import DriverForm from './components/DriverForm';
import ViewBanner from './components/ViewBanner';

import Locale from 'utils/locale';
import icons from 'constants/icons';
import colors from 'styles/colors';
import { FormContainer } from './usermanagementform.style';

class DriverFormContainer extends Component {
  static propTypes = {
    addDriver: PropTypes.func.isRequired,
    editable: PropTypes.arrayOf(PropTypes.string),
    driver: PropTypes.object.isRequired, // eslint-disable-line
    states: PropTypes.any.isRequired, // eslint-disable-line
    countries: PropTypes.array.isRequired, // eslint-disable-line
    groupData: PropTypes.array.isRequired, // eslint-disable-line
    navigator: PropTypes.any, // eslint-disable-line
  };

  static defaultProps = {
    editable: null,
  };

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
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentDidMount() {
    // this.props.fetchCountriesList();
    // this.props.fetchStatesList();
  }

  onNavigatorEvent = (event) => {
    if (event.id === 'closeModal') {
      this.props.navigator.dismissModal();
    }
  };

  handleDriverFormSubmit = (values) => {
    if (values) {
      const { navigator } = this.props;
      this.props.addDriver(values, navigator);
    } else {
      // TODO: Throw error. This should have been caught by ReduxForm though!
    }
  };

  handleOpenGroupPicker = (onChange) => {
    this.props.navigator.showModal({
      screen: 'CopartTransporter.NewDriverGroupPicker',
      title: 'Pick a Group',
      passProps: {
        groupData: this.props.groupData,
        onGroupSelect: onChange,
      },
    });
  };

  render() {
    const { driver, editable } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: colors.WHITE }}>
        <ViewBanner
          headerTitle={Locale.translate('userManagement.driverForm.bannerTitle.createForm')}
        />
        <ScrollView>
          <FormContainer>
            <DriverForm
              navigator={this.props.navigator}
              onDriverFormSubmit={this.handleDriverFormSubmit}
              openGroupPicker={this.handleOpenGroupPicker}
              driver={driver}
              editable={editable}
              groups={this.props.groupData}
              buttonLabel={Locale.translate(
                'userManagement.driverForm.bannerTitle.createFormBtnTitle',
              )}
              // onCancel={this.closeDriverForm}
            />
          </FormContainer>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  ...groupsSelector(state),
  ...userManagementRootSelector(state),
});

const mapDispatchToProps = {
  addDriver,
  fetchCountriesList,
  fetchStatesList,
};

export default connect(mapStateToProps, mapDispatchToProps)(DriverFormContainer);
