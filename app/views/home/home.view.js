// @flow

import type { HomeScreenProps, HomeCounts } from './home.type';
import type { RemoteMessage } from 'react-native-firebase';

import React, { Component } from 'react';
import { View, Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import renderIf from 'render-if';
import firebase from 'react-native-firebase';
import { requestCodePushSync } from 'services/codePushSyncer';

import { getHomeScreenCounts, registerForNotifications } from './home.action';
import {
  changeCurrentVehicle,
  updateLocation,
  setConnectivity,
} from 'views/settings/settings.action';
import { homeSelector } from './home.redux';
import { signoutUser, setActiveProfile } from '../login/login.action';

import SearchBar from 'components/custom/SearchBar';
import ButtonGrid from './components/ButtonGrid';
import UserWidget from './components/UserWidget';
import { OfflineBanner } from 'components/custom/Banner';

import Locale from 'utils/locale';
import NavListener from 'utils/NavigationListener';
import LocListener from 'utils/locationListener';
import { badgeColors } from 'styles/colors';
import { defaultNavStyles } from 'styles';
// import ConnectionListener from 'utils/ConnectionListener';
// null to skip first tab item
// const tabBadgeIndexMap = [null, 'assignedTrips', 'acceptedTrips', 'inProgress', 'inTransit'];

const FCM = firebase.messaging();

const defaultProps = {
  assignedTrips: [],
};
class Home extends Component<HomeScreenProps> {
  static defaultProps = defaultProps;
  static homeScreenCounterListener = null;
  static messageListener = null;

  constructor(props: any) {
    super(props);
    const { navigator } = this.props;
    navigator.setOnNavigatorEvent(this.onNavigatorEvent);

    NavListener.handleTabChange(0);
  }

  componentWillMount() {
    requestCodePushSync();
    LocListener.register(this);

    this.homeScreenCounterListener = setInterval(() => {
      this.props.getHomeScreenCounts(this.props.navigator);
    }, 1 * 60 * 1000);
    this.props.getHomeScreenCounts(this.props.navigator);

    if (Platform.OS === 'ios') {
      FCM.requestPermissions()
        .then(() => {
          this.initializeFCM();
        })
        .catch((error: any) => {
          // User has rejected permissions
          console.log('user rejected permissions: ', error);
        });
    } else {
      this.initializeFCM();
    }
  }

  componentDidMount() {
    this.messageListener = FCM.onMessage((message: RemoteMessage) => {
      console.log('FCM - remote message received: ', message);

      let notificationTitle = null;
      let notificationBody = null;

      if (Platform.OS === 'ios') {
        const notification = message.notification;
        const { title = '', body } = notification;
        notificationTitle = title;
        notificationBody = body;
      } else {
        const { title = '', body } = message.fcm;
        notificationTitle = title;
        notificationBody = body;
      }

      if (notificationTitle && notificationBody) {
        this.props.navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'warning',
            content: `${notificationTitle}\n${notificationBody}`,
          },
          autoDismissTimerSec: 4,
        });
      }
    });
  }

  // componentWillReceiveProps(nextProps: Props) {
  // Disable Badge counts
  // if (this.props.counts !== nextProps.counts) {
  //   tabBadgeIndexMap.forEach(this.updateBadgeCount(nextProps.counts));
  // }
  // }

  componentWillUnmount() {
    clearInterval(this.homeScreenCounterListener);
    this.messageListener();
  }

  onNavigatorEvent = (event: Object) => {
    if (event.type === 'DeepLink') {
      const links = event.link.split('/');
      if (links && links[0] === 'tab' && links[1] === '0' && links[2] === 'popToRoot') {
        this.props.navigator.popToRoot({
          animated: false,
        });
      }
    }
    switch (event.id) {
      case 'signout':
        Alert.alert('Warning', 'Are you sure you want to Sign out?', [
          {
            text: 'Yes',
            onPress: () => this.props.signoutUser(),
          },
          {
            text: 'Cancel',
            onPress: () => {},
          },
        ]);
        break;
      case 'bottomTabSelected':
        NavListener.handleTabChange(0);
        break;
      default:
        console.log('unhandled event', event.id); // eslint-disable-line
    }
  };

  updateBadgeCount = (counts: HomeCounts) => (key: string, index: number) => {
    if (key) {
      this.props.navigator.setTabBadge({
        tabIndex: index,
        badge: counts[key] || 0,
        badgeColor: badgeColors[key],
      });
    }
  };

  initializeFCM = () => {
    const { email } = this.props;
    FCM.getToken()
      .then((token: string) => {
        this.props.registerForNotifications(token, email);
      })
      .catch((error: Object) => {
        console.log('FCM error ', error);
        // User has rejected permissions
      });
  };

  handleSearchSubmit = (query: string) => {
    this.props.navigator.showModal({
      screen: 'CopartTransporter.GlobalSearch',
      title: 'Search',
      passProps: {
        query,
      },
    });
  };

  openProfileSelection = () => {
    this.props.navigator.showModal({
      screen: 'CopartTransporter.Settings.ProfileSelection',
      animated: true,
      animationType: 'fade',
    });
  };

  handlePress = (key: string) => {
    this.props.navigator.push({
      screen: `CopartTransporter.${key}`,
      title: key === 'Signup' ? 'Sign Up' : 'Login',
      animated: true,
      animationType: 'fade',
      backButtonTitle: undefined,
      navigatorStyle: defaultNavStyles,
    });
  };

  handleSettingsPress = () => {
    this.props.navigator.push({
      screen: 'CopartTransporter.Settings',
      title: Locale.translate('setting.title'),
      navigatorStyle: defaultNavStyles,
    });
  };

  render() {
    const renderIfIsOffline = renderIf(!this.props.connectionStatus);
    const { counts, activeVendor, user, navigator, settings } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {renderIfIsOffline(<OfflineBanner />)}
        <SearchBar
          resetSearchBar={() => {}}
          onSubmit={this.handleSearchSubmit}
          showCancel={false}
          clearOnSubmit
        />
        <UserWidget
          activeVendor={activeVendor}
          memberships={user.memberships}
          handleSettingsPress={this.handleSettingsPress}
          currentVehicle={settings.currentVehicle}
          changeCurrentVehicle={this.props.changeCurrentVehicle}
        />
        <View style={{ flex: 1 }}>
          <ButtonGrid
            navigator={navigator}
            role={this.props.role}
            user={this.props.user}
            counts={counts}
          />
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = {
  registerForNotifications,
  getHomeScreenCounts,
  signoutUser,
  setActiveProfile,
  changeCurrentVehicle,
  updateLocation,
  setConnectivity,
};

export default connect(homeSelector, mapDispatchToProps)(Home);
