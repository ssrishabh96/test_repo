import React from 'react';
import { View, FlatList } from 'react-native';
import { defaultTo } from 'ramda';

import CategoryItem from './CategoryItem';
import styles from '../styles';

const defaultToZero = defaultTo(0);

type Props = {
  data: Object,
  field: string,
  onPress: () => any,
  selectedFilters: Object,
};
export default ({ data, field, onPress, selectedFilters }: Props) => (
  <View style={styles.categoryColor}>
    <FlatList
      data={data}
      extraData={{ field, ...selectedFilters }}
      renderItem={({ item }) => (
        <CategoryItem
          key={item.field}
          item={item}
          active={field === item.field}
          count={defaultToZero(selectedFilters[item.field] && selectedFilters[item.field].count)}
          onPress={onPress}
        />
      )}
    />
  </View>
);
