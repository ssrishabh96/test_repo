// @flow

import React from 'react';
import { View, Dimensions, Text } from 'react-native';

import Switch from 'components/core/Switch';

import colors from 'styles/colors';

const { width } = Dimensions.get('screen');

type Props = {
  switchValue: string,
  onChangeStatus: (status: string, dispatchableFlag: boolean) => void,
  active: boolean,
  status: string,
  dispatchableFlag: boolean,
};

const SwitchItem = ({ switchValue, onChangeStatus, active, status, dispatchableFlag }: Props) => (
  <View>
    <Switch
      onChangeState={() => onChangeStatus(status, dispatchableFlag)}
      style={styles.switchContainer}
      buttonStyle={styles.switchButton}
      inactiveButtonColor={colors.COPART_BLUE}
      activeButtonColor={colors.DARK_GREEN}
      activeButtonPressedColor={colors.DARK_GREEN}
      activeBackgroundColor="#ddd"
      inactiveBackgroundColor="#ddd"
      active={active}
      buttonRadius={23}
      switchWidth={width / 2}
      switchHeight={47}
      buttonContent={() => <Text style={{ color: '#fff', fontWeight: 'bold' }}>{switchValue}</Text>}
    />
  </View>
);

const styles = {
  switchContainer: {
    marginVertical: 10,
    width: width / 2,
  },
  switchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 22.5,
    padding: 5,
    width: width / 4,
  },
};

export default SwitchItem;
