import { AppState } from 'react-native';

class LocationListener {
  watchID = null;
  handleAppStateChange = (nextAppState) => {
    if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.startWatching();
    }
    if (this.appState === 'active' && nextAppState.match(/inactive|background/)) {
      this.stopWatching();
    }
    this.appState = nextAppState;
  };
  register(context) {
    this.context = context;
    this.appState = AppState.currentState;
    this.startWatching();
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  startWatching() {
    if (this.watchID === null) {
      this.watchID = navigator.geolocation.watchPosition(
        ({ coords, timestamp }) => {
          this.updateLocation({ coords, timestamp });
        },
        (error) => {
          console.log('LOCATION ERROR', error);
        },
        {
          timeout: 20000, // how long does the API have to return the position before throwing an error?
          distanceFilter: 10, // how many meters a user has to move before a callback is triggered again.
        },
      );
    }
  }
  updateLocation(position) {
    this.context.props.updateLocation(position);
  }

  stopWatching() {
    navigator.geolocation.clearWatch(this.watchID);
    this.watchID = null;
  }
}

const locListener = new LocationListener();
export default locListener;
