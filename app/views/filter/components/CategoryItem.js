import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import styles from '../styles';

type Props = {
  item: {
    field: string,
    label: string,
    values: Array<Object>,
  },
  active: boolean,
  count: number,
  onPress: () => any,
};
export default class CategoryItem extends React.PureComponent<Props> {
  render() {
    const { item, active = false, count, onPress } = this.props;
    return (
      <View style={active ? styles.activeCategory : null}>
        <TouchableHighlight
          underlayColor="#acacac"
          style={styles.categoryButton}
          onPress={() => onPress(item.field, item.label, item.values)}
        >
          <View style={styles.valueWrap}>
            <Text style={styles.categoryText}>{item.label}</Text>
            {count > 0 && <Badge count={count} />}
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const Badge = ({ count }: { count: number }) => (
  <View style={styles.badgeView}>
    <Text style={{ fontSize: 14, color: 'black' }}>{count}</Text>
  </View>
);
