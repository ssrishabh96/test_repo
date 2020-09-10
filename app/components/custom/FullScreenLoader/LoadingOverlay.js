// @flow

import React from 'react';
import { StyleSheet, View, Modal, ActivityIndicator } from 'react-native';

/**
 * Full Screen Modal Loading indicator
 * This disables any interaction on the view underneath
 * @param {loading} boolean value
 */
const LoadingOverlay = ({ loading }: { loading: boolean }) => (
  <Modal
    transparent
    animationType={'none'}
    visible={loading}
    onRequestClose={() => {}}
  >
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator
          size={'large'}
          animating={loading}
        />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default LoadingOverlay;
