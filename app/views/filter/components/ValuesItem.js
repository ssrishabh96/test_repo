import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';
import colors from 'styles/colors';

type Props = {
  item: {
    code: string,
    description: string,
    count: number,
  },
  field: string,
  checked: boolean,
  onPress: () => any,
};
export default class ValuesItem extends React.PureComponent<Props> {
  render() {
    const { item, field, checked = false, onPress } = this.props;
    return (
      <TouchableOpacity
        style={styles.rowOptions}
        onPress={() => onPress(field, item.code)}
      >
        <Icon
          size={22}
          name={checked ? 'check-square-o' : 'square-o'}
          color={checked ? colors.LIGHT_GREEN : 'black'}
          style={styles.checkBox}
        />
        <View style={styles.valueWrap}>
          <Text style={styles.valueText}>{item.description}</Text>
          <Text style={styles.valueCount}>({item.count})</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
