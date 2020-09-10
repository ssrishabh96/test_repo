import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import colors from 'styles/colors';

import styles from '../settings.style';

type itemProps = {
  item: Object,
  onPress: Function,
  value: string | null,
};
const renderItem = ({ item, onPress, value }: itemProps) => {
  // console.log(item);
  switch (item.viewType) {
    case 'fixedData':
      return (
        <View style={styles.flexDirectionRow}>
          <Text style={styles.flatListKeyItemStyle}>{item.label}</Text>
          <Text style={styles.flatListValueItemStyle}> {value || item.value} </Text>
        </View>
      );
    case 'link':
      return (
        <TouchableOpacity
          onPress={onPress}
          style={styles.flexDirectionRow}
        >
          <Text style={styles.flatListKeyItemStyle}>{item.label}</Text>
          {!!value && <Text style={{ color: colors.COPART_BLUE }}>{value}</Text>}
          <View style={styles.iconViewStyle}>
            <Icon
              size={22}
              name={'angle-right'}
              color={colors.COPART_BLUE}
              style={{ marginHorizontal: 5 }}
            />
          </View>
        </TouchableOpacity>
      );
    case 'button':
      return (
        <View style={styles.flexDirectionRow}>
          <Text style={styles.flatListKeyItemStyle}>{item.label}</Text>
          <TouchableOpacity
            onPress={onPress}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{item.buttonLabel}</Text>
          </TouchableOpacity>
        </View>
      );
    case 'touchable':
      return (
        <TouchableOpacity
          onPress={onPress}
          style={[styles.flexDirectionRow]}
        >
          <View style={[styles.flexDirectionRow]}>
            <Text style={[styles.flatListCenteredItemStyle]}>{item.label}</Text>
          </View>
        </TouchableOpacity>
      );
    default:
      return null;
  }
};

export default ({ item, onPress, value }: itemProps) => (
  <View style={[styles.itemWrapper]}>{renderItem({ item, onPress, value })}</View>
);
