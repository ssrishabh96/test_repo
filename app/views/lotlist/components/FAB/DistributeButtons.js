import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
import ActionButton from 'react-native-action-button';

import icons from 'constants/icons';
import * as USERROLES from 'constants/user/roles';

const renderActionButtonItems = (role, onItemClick) => {
  const items = [
    renderIf(role < USERROLES.GROUP_MANAGER)(
      <ActionButton.Item
        title="Group"
        buttonColor="#1d5ab9"
        onPress={() => onItemClick('group')}
      >
        <Image source={icons.tripsScreen.tripIconGroup} />
      </ActionButton.Item>,
    ),
    <ActionButton.Item
      title="Driver"
      buttonColor="#1d5ab9"
      onPress={() => onItemClick('driver')}
    >
      <Image source={icons.tripsScreen.tripIconDriver} />
    </ActionButton.Item>,
  ];
  return items.filter(item => item);
};

const DistributeButtons = ({ role, onItemClick }) => (
  <ActionButton
    title="Distribute"
    buttonColor="#323742"
    icon={<Image source={icons.tripsScreen.tripIconDistribute} />}
    degrees={0}
  >
    {renderActionButtonItems(role, onItemClick)}
  </ActionButton>
);

DistributeButtons.propTypes = {
  onItemClick: PropTypes.func.isRequired,
  role: PropTypes.number.isRequired,
};

DistributeButtons.defaultProps = {
  role: USERROLES.DRIVER,
};

export default DistributeButtons;
