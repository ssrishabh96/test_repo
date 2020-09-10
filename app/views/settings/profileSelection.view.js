import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { propOr } from 'ramda';

import { connect } from 'react-redux';
import { homeSelector } from 'views/home/home.redux';
import { setActiveProfile, getUserInfoAction } from 'views/login/login.action';

import { defaultNavStyles } from 'styles';
import colors from 'styles/colors';
import Locale from 'utils/locale';

import VendorList from './components/VendorList';

class ProfileSelection extends Component {
  static navigatorStyle = defaultNavStyles;
  static navigatorButtons = {
    leftButtons: [
      {
        // icon: icons.tripsScreen.tripIconClose,
        id: 'back',
        title: 'Back',
      },
    ],
  };
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  componentWillMount() {
    if (this.props.retrieveUserInfo) this.props.getUserInfoAction();
  }
  onNavigatorEvent = (event: Object) => {
    if (event.id === 'back') {
      this.props.close(this.props.navigator);
      this.props.reject();
    }
    if (event.id === 'backPress') {
      // this.props.close(this.props.navigator);
      // this.props.reject();
    }
  };
  saveSelection = (vendor) => {
    this.props.setActiveProfile(vendor);
    this.props.close(this.props.navigator);
    setTimeout(this.props.resolve, 500); // must wait for close animation to finish
  };
  render() {
    const { user: { name, profiles: { isLoading, profileInfo } } } = this.props;
    return (
      <View style={styles.wrapper}>
        <View style={[styles.header, styles.bottomBorder]}>
          <Text style={styles.title}>
            {Locale.translate('settings.vendorProfile.welcome')} {name}!
          </Text>
          <Text style={styles.subtitle}>
            {Locale.translate('settings.vendorProfile.pleaseSelect')}
          </Text>
        </View>
        {isLoading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator
              animating={isLoading}
              size="large"
            />
            <Text style={styles.loadingText}>
              {Locale.translate('settings.vendorProfile.loading')}
            </Text>
          </View>
        ) : (
          <VendorList
            vendors={profileInfo.vendors}
            onSelect={this.saveSelection}
            selected={propOr(undefined, 'vendor_id')(this.props.activeVendor)}
          />
        )}
      </View>
    );
  }
}

ProfileSelection.propTypes = {
  user: PropTypes.object,
  getUserInfoAction: PropTypes.func.isRequired,
  setActiveProfile: PropTypes.func.isRequired,
  resolve: PropTypes.func,
  activeVendor: PropTypes.object,
  reject: PropTypes.func,
  retrieveUserInfo: PropTypes.bool,
  close: PropTypes.func,
};

ProfileSelection.defaultProps = {
  user: {
    name: '',
    profiles: {
      isLoading: false,
      activeProfiles: {},
      profileInfo: {},
    },
  },
  retrieveUserInfo: false,
  resolve: () => null,
  reject: () => null,
  close: navi => navi.pop(),
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#efefef' },
  header: {
    marginBottom: 15,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  bottomBorder: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_LIGHT,
  },
  title: { fontWeight: 'bold', fontSize: 18, color: colors.COPART_BLUE },
  subtitle: { margin: 10, color: colors.COPART_BLUE },
  loadingWrapper: { flex: 1, alignItems: 'center' },
  loadingText: { fontSize: 14, marginVertical: 10 },
});

const mapDispatchToProps = {
  setActiveProfile,
  getUserInfoAction,
};

export default connect(homeSelector, mapDispatchToProps)(ProfileSelection);
