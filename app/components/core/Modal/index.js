// @flow

import type { Node } from 'react';

import React from 'react';
import Modal from 'react-native-modal';
import styles from './styles';

type Props = {
  children: Node,
  isModalVisible: true | false,
  onBackDropPress: () => void,
  onBackButtonPress: () => void,
  style: Object,
};

const ModalComponent = (props: Props) => (
  /**
   * @param {bool} isVisible - used to toggle the visibility of modal
   * @param {object} style - extra styles if needed can be passed through this prop
   * @param {function} onBackDropPress - handler for backdrop press
   * @param {function} onBackButtonPress - handler for hardware back button press on Android
   * @returns {React.Component}
   */
  <Modal
    isVisible={props.isModalVisible}
    style={[styles.modalStyle, props.style]}
    onBackdropPress={props.onBackDropPress}
    onBackButtonPress={props.onBackButtonPress}
    useNativeDriver
  >
    {props.children}
  </Modal>
);

ModalComponent.defaultProps = {
  isModalVisible: false,
  onBackdropPress: () => {},
  style: {},
};

export default ModalComponent;
