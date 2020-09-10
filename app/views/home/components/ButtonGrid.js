import type { RNNNavigator } from 'types/RNNavigation';
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Image } from 'react-native';
import { prop } from 'ramda';
import LinearGradient from 'react-native-linear-gradient';
import debounce from 'debounce';

import PropTypes from 'prop-types';
import Locale from 'utils/locale';

import { CountBadge } from 'components/custom/Lot/Badges';

import colors from 'styles/colors';
import { styles } from './styles';

import NavListener from 'utils/NavigationListener';
import { getHomeGridDataForUser } from 'config/UserManager';
import { homeGridData } from './homeGridData';

type GridItemProps = {
  element: {},
  count: number,
  onPress: Function,
  right: number,
  top: number,
  badgeColor: string,
};
const GridItem = ({ element, count, onPress, right, top, badgeColor }: GridItemProps) =>
  element ? (
    <TouchableHighlight
      onPress={() => onPress(element)}
      style={{ flex: 1, justifyContent: 'center' }}
    >
      <LinearGradient
        start={{ x: 0.1, y: 0.1 }}
        colors={['rgb(221, 221, 221)', 'white']}
        style={[{ flex: 1 }, styles.gridStyle]}
      >
        <View style={{ alignItems: 'center' }}>
          {count && count > 0 ? (
            <CountBadge
              count={count}
              containerStyle={{
                backgroundColor: badgeColor || colors.DARK_RED,
                position: 'absolute',
                right,
                top,
                zIndex: 100,
              }}
              textStyle={{
                fontSize: 13,
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          ) : null}
          <Image
            resizeMode={'center'}
            source={element.icon}
          />
          <Text style={styles.fontStyles}>{Locale.translate(element.localizedString)}</Text>
        </View>
      </LinearGradient>
    </TouchableHighlight>
  ) : (
    <LinearGradient
      start={{ x: 0.1, y: 0.1 }}
      colors={['rgb(221, 221, 221)', 'white']}
      style={[{ flex: 1 }, styles.gridStyle]}
    />
  );

type ButtonGridProps = {
  role: 1 | 2 | 3,
  counts: { [string]: number },
  navigator: RNNNavigator,
};
class ButtonGrid extends Component<ButtonGridProps> {
  handleNavigation = debounce(
    (element: Object) => {
      const tabIndex = prop('tabIndex')(element);
      if (tabIndex) {
        this.props.navigator.switchToTab({
          tabIndex,
        });
        NavListener.handleTabChange(tabIndex);
      } else {
        this.props.navigator.push({
          screen: element.destinationScreen,
          title: element.title,
          passProps: element.passProps || {},
        });
      }
    },
    400,
    false, // imediate
  );

  render() {
    const { counts, role } = this.props;
    const rowData = getHomeGridDataForUser(homeGridData, role);
    return (
      <View style={styles.grid}>
        {rowData.map((data, index) => (
          <View
            style={styles.row}
            key={index}
          >
            {data.map((element, i) => (
              <GridItem
                key={i}
                element={element}
                count={counts[element && element.id]}
                right={element && element.right}
                top={element && element.top}
                badgeColor={element && element.badgeColor}
                onPress={this.handleNavigation}
              />
            ))}
          </View>
        ))}
      </View>
    );
  }
}

ButtonGrid.defaultProps = {
  counts: {},
};

export default ButtonGrid;
