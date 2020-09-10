import React from 'react';
import { Image } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import icons from 'constants/icons';
import colors from 'styles/colors';

type DisabledIconProps = {
  +isAssignedAsDriver: boolean,
  +hasLotWithIssue: boolean,
  +itemNotDistributable: boolean,
  +groupDoesNotMatchSelected: boolean,
};

export default ({
  isAssignedAsDriver,
  hasLotWithIssue,
  itemNotDistributable,
  groupDoesNotMatchSelected,
}: DisabledIconProps) => {
  if (isAssignedAsDriver) {
    return (
      <Image
        source={icons.tripsScreen.tripIconDriver}
        style={{ tintColor: colors.COPART_BLUE, marginRight: 5 }}
      />
    );
  } else if (hasLotWithIssue) {
    return (
      <Icon
        name={'bookmark'}
        size={20}
        color={colors.DARK_RED}
        style={{
          right: 5,
          backgroundColor: 'transparent',
          shadowColor: colors.LIGHT_RED,
          opacity: 0.96,
        }}
      />
    );
  } else if (itemNotDistributable) {
    return (
      <Image
        source={icons.homeScreen.homeIconInProgress}
        style={{ width: 20, height: 20, tintColor: colors.COPART_BLUE, marginRight: 5 }}
      />
    );
  } else if (groupDoesNotMatchSelected) {
    return (
      <Image
        source={icons.tripsScreen.tripIconGroup}
        style={{ tintColor: colors.COPART_BLUE, marginRight: 5 }}
      />
    );
  }
  return null;
};
