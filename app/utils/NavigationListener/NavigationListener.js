import { NativeAppEventEmitter, DeviceEventEmitter, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';

class NavigationListener {
  tab = null;
  constructor() {
    this.emitter = Platform.OS === 'android' ? DeviceEventEmitter : NativeAppEventEmitter;
  }

  register() {
    if (Platform.OS === 'android') {
      this.bottomTabReselectedSubscription = this.emitter.addListener(
        'bottomTabReselected',
        this.bottomTabReselected,
      );
    }
  }

  unregister() {
    if (this.bottomTabReselectedSubscription) {
      this.bottomTabReselectedSubscription.remove();
    }
  }

  bottomTabReselected = (params) => {
    Navigation.handleDeepLink({
      link: `tab/${this.tab}/popToRoot`,
    });
  };
  handleTabChangeWithoutPopping = (tab) => {
    this.tab = tab;
  };
  handleTabChange = (tab) => {
    if (this.tab !== undefined) {
      if (this.tab !== tab) {
        Navigation.handleDeepLink({
          link: `tab/${this.tab}/popToRoot`,
        });
        this.tab = tab;
      }
    } else {
      this.tab = tab;
    }
  };
}

const NavListener = new NavigationListener();

export default NavListener;
