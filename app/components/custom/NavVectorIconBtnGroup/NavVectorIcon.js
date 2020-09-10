// @flow

import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const NavVectorIcon = (props: { iconName: string, color: string }) => (
  <Icon
    name={props.iconName}
    color={props.color}
  />
);

export default NavVectorIcon;
