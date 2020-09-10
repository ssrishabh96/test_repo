import { NetInfo, Platform } from 'react-native';
import { store } from '../../../app/index';
/*
type: none
type: wifi
type: cellular
*/
const setConnectivity = connectionStatus => ({
  type: 'SET_CONNECTIVITY',
  connectionStatus,
  timestamp: Date.now(),
});

class ConnectionListener {
  status = null;
  listening = false;
  registered = false;
  register() {
    if (!this.registered) {
      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange); // on ios it goes off immediately with the initial connection status, andriod does not
      if (Platform.OS === 'android') {
        // RN bug. always returns false on ios; is correct on android;
        NetInfo.isConnected.fetch().done(this.handleConnectionChange);
      }
      this.registered = true;
    }
  }
  handleConnectionChange = (status) => {
    this.status = status;
    store.dispatch(setConnectivity(status));
  };
}
const connectionListener = new ConnectionListener();
export default connectionListener;
