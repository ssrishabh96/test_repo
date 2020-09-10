import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import BarcodeScanner from 'react-native-barcode-scanner-universal';
import debounce from 'debounce';

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
});
class Scanner extends Component {
  hasNotReadBarcode = true;
  closeView = debounce(
    () => {
      this.props.navigator.pop({
        animated: true,
        animationType: 'slide-horizontal',
      });
    },
    400,
    true,
  );
  render() {
    const { onBarCodeRead, navigator, key1 } = this.props;
    let scanArea = null;
    if (Platform.OS === 'ios') {
      scanArea = (
        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle} />
        </View>
      );
    }
    return (
      <View style={styles.camera}>
        <BarcodeScanner
          onBarCodeRead={(code) => {
            if (this.hasNotReadBarcode) {
              this.closeView();
              onBarCodeRead(key1, code.data);
            }
            this.hasNotReadBarcode = false;
          }}
          style={styles.camera}
        >
          {scanArea}
        </BarcodeScanner>
      </View>
    );
  }
}
Scanner.propTypes = {
  onBarCodeRead: PropTypes.func.isRequired,
  key1: PropTypes.string.isRequired,
  navigator: PropTypes.any.isRequired, // eslint-disable-line
};
export default Scanner;
