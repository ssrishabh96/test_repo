import { Platform, StatusBar } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import trackJs from 'react-native-trackjs';
import debounce from 'debounce';

import Locale from 'utils/locale';
import NavListener from 'utils/NavigationListener';
import connectionListener from 'utils/ConnectionListener';

import configureStore from './configureStore';

import { registerScreens } from './screens';

import { defaultNavStyles } from './styles';
import COLORS from './styles/colors';
import icons from './constants/icons';

import { getNavBarRightButtonsForUser, updateUserRole } from 'config/UserManager';
import { getUserRole, getLoginStatus, getActiveVendor } from 'views/login/login.redux';

// TODO for view networks calls in chrome dev tools
// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

StatusBar.setBarStyle('light-content', true);

const {
  bottomNavigation: {
    navIconHomeActive,
    navIconHomeInactive,
    navIconAssignedActive,
    navIconAssignedInactive,
    navIconAcceptedActive,
    navIconAcceptedInactive,
    navIconInProgressActive,
    navIconInProgressInactive,
    navIconInTransitInactive,
    navIconInTransitActive,
  },
} = icons;

console.disableYellowBox = true;
console.log('Starting app'); // eslint-ignore-line

trackJs.init({ token: '05ed9e2b117440409ff0db17542a091c', application: 'coparttransporter' });

class App {
  constructor(store) {
    store.subscribe(
      Platform.OS === 'ios'
        ? debounce(this.onStoreUpdate.bind(this), 400)
        : this.onStoreUpdate.bind(this),
    );
    connectionListener.register();
  }

  onStoreUpdate() {
    const userRole = getUserRole(store.getState());
    const vendorId = getActiveVendor(store.getState());
    const { languageCode } = store.getState().settings;
    Locale.setLanguage(languageCode);

    const isLoggedIn = getLoginStatus(store.getState());
    // handle a root change

    // TODO might need to re-think on this.
    if (
      this.isLoggedIn !== isLoggedIn ||
      this.languageCode !== languageCode ||
      (isLoggedIn && this.userRole !== userRole) ||
      (isLoggedIn && this.vendorId !== vendorId)
    ) {
      this.isLoggedIn = isLoggedIn;
      this.vendorId = vendorId;
      updateUserRole(userRole);
      const root = isLoggedIn ? 'loggedIn' : 'login';

      console.log('Updating root', root);
      this.startApp(root, userRole);

      this.userRole = userRole;
      this.languageCode = languageCode;
    }
  }

  startApp(root, userRole) {
    this.appStarted = true;
    const SignoutButton = {
      title: Locale.translate('home.SignOut'),
      id: 'signout',
    };

    const LOGIN = {
      screen: 'CopartTransporter.Login',
      title: 'LOGIN',
      navigatorStyle: {
        navBarHidden: true,
      },
    };

    const TABS = [
      {
        label: Locale.translate('tab.Home'),
        screen: 'CopartTransporter.Home',
        icon: navIconHomeInactive,
        selectedIcon: navIconHomeActive,
        title: Locale.translate('tab.Home'),
        navigatorStyle: defaultNavStyles,
        navigatorButtons: {
          rightButtons: [SignoutButton],
        },
      },
      {
        label: Locale.translate('home.Assigned'),
        screen: 'CopartTransporter.AssignedRun',
        icon: navIconAssignedInactive,
        selectedIcon: navIconAssignedActive,
        title: Locale.translate('home.Assigned'),
        navigatorStyle: defaultNavStyles,
        navigatorButtons: {
          rightButtons: getNavBarRightButtonsForUser(userRole),
        },
        overrideBackPress: true,
      },
      {
        label: Locale.translate('home.Acknowledged'),
        screen: 'CopartTransporter.AcknowledgedRun',
        icon: navIconAcceptedInactive,
        selectedIcon: navIconAcceptedActive,
        title: Locale.translate('home.Acknowledged'),
        navigatorStyle: defaultNavStyles,
        navigatorButtons: {
          rightButtons: getNavBarRightButtonsForUser(userRole),
        },
        overrideBackPress: true,
      },
      {
        label: Locale.translate('home.InProgress'),
        screen: 'CopartTransporter.InProgressRun',
        icon: navIconInProgressInactive,
        selectedIcon: navIconInProgressActive,
        title: Locale.translate('home.InProgress'),
        navigatorStyle: defaultNavStyles,
        navigatorButtons: {
          rightButtons: [
            {
              id: 'search',
              icon: icons.tripsScreen.tripIconSearch,
            },
          ],
        },
        overrideBackPress: true,
      },
      {
        label: Locale.translate('home.InTransit'),
        screen: 'CopartTransporter.InTransit', // TODO: Navigate to respective screen
        icon: navIconInTransitInactive,
        selectedIcon: navIconInTransitActive,
        title: Locale.translate('home.InTransit'),
        navigatorStyle: defaultNavStyles,
        navigatorButtons: {
          rightButtons: [
            {
              id: 'search',
              icon: icons.tripsScreen.tripIconSearch,
            },
            {
              id: 'checkin',
              icon: icons.navLocationChecked,
            },
          ],
        },
        overrideBackPress: true,
      },
    ];

    switch (root) {
      case 'loggedIn':
        NavListener.register();
        Navigation.startTabBasedApp({
          tabs: TABS,
          tabsStyle: {
            initialTabIndex: 0,
          },
          appStyle: {
            orientation: 'portrait',
            bottomTabBadgeTextColor: 'white',
            bottomTabBadgeBackgroundColor: COLORS.LIGHT_GREEN,
            hideBackButtonTitle: true,
            forceTitlesDisplay: true,
            tabBarSelectedButtonColor: COLORS.COPART_BLUE,
          },
          passProps: {},
          animationType: 'slide-down',
        });
        return;
      default:
        Navigation.startSingleScreenApp({
          screen: LOGIN,
          appStyle: {
            orientation: 'portrait',
          },
        });
    }
  }
}

export let store = null;
configureStore((appStore) => {
  store = appStore;
  registerScreens(store, Provider);
  new App(store);
});
