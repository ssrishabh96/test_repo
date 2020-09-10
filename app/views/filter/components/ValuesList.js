import React from 'react';
import { FlatList } from 'react-native';

import ValuesItem from './ValuesItem';

type Props = {
  data: Object,
  selectedFilters: Object,
  field: string,
  onPress: () => any,
};
export default ({ data, selectedFilters, field, onPress }: Props) => (
  <FlatList
    data={data}
    extraData={selectedFilters}
    renderItem={({ item }) => (
      <ValuesItem
        key={item.code}
        item={item}
        field={field}
        onPress={onPress}
        checked={selectedFilters[field] && selectedFilters[field][item.code]}
      />
    )}
  />
);
