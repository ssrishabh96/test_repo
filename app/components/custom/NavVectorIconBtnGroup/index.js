// @flow

import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
  handlePress: () => any,
  buttons: Array<{
    iconName: string,
  }>,
};

type Button = {
  iconName: string,
};

class NavVectorIconBtnGroup extends Component<Props> {
  static defaultProps = {
    handlePress: () => {},
  };

  render() {
    const { handlePress, buttons } = this.props;
    return (
      <View style={[styles.navbarIconContainer]}>
        {buttons.map((btn: Button) => (
          <TouchableOpacity
            key={btn.iconName}
            onPress={handlePress}
            style={{ paddingRight: 15 }}
          >
            <Icon
              size={25}
              name={btn.iconName}
              color="#fff"
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navbarIconContainer: {
    flexDirection: 'row',
  },
});

export default NavVectorIconBtnGroup;
