import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import colors from 'styles/colors';
import locale from 'utils/locale';

type Props = {
  +onAccept: () => any,
  +onDecline: () => any,
  +onClose: () => any,
  +buttonType: 'AcceptDecline' | 'Dismiss',
};
export default ({ onAccept, onDecline, onClose, buttonType }: Props) => {
  switch (buttonType) {
    case 'AcceptDecline':
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onDecline}
            style={[styles.button, styles.decline]}
          >
            <Text style={styles.label}>{locale.translate('setting.Terms.Decline')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAccept}
            style={[styles.button, styles.accept]}
          >
            <Text style={styles.label}>{locale.translate('setting.Terms.Accept')}</Text>
          </TouchableOpacity>
        </View>
      );
    case 'Dismiss':
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.button, styles.accept]}
          >
            <Text style={styles.label}>{locale.translate('setting.Terms.Dismiss')}</Text>
          </TouchableOpacity>
        </View>
      );
    default:
      return null;
  }
};
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.OFF_WHITE,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#d3d3d3',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 6,
    padding: 5,
    marginHorizontal: 15,
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  accept: {
    backgroundColor: colors.COPART_BLUE,
  },
  decline: {
    backgroundColor: '#666e6a',
  },
});
