import React from 'react';
import { FlatList, TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import icons from 'constants/icons';

import colors from 'styles/colors';

type RowProps = {
  onPress: Function,
  label: string,
  selected: boolean,
};
const VendorRow = ({ onPress, label, selected }: RowProps) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.container, styles.bottomBorder]}>
      <View style={[styles.centered]}>
        <Text style={styles.row}>{label}</Text>
      </View>
      {selected && (
        <Image
          style={styles.checkBox}
          resizeMode="contain"
          source={icons.navIconAcceptedActive}
        />
      )}
    </View>
  </TouchableOpacity>
);

type VendorListProps = {
  vendors: Object[],
  onSelect: Function,
  selected: number | undefined,
};
const VendorList = ({ vendors, onSelect, selected }: VendorListProps) => (
  <FlatList
    data={vendors}
    renderItem={({ item }) => (
      <VendorRow
        label={item.vendor_name}
        onPress={() => onSelect(item)}
        selected={selected === item.vendor_id}
      />
    )}
    keyExtractor={item => item.vendor_id}
  />
);
const styles = StyleSheet.create({
  container: {
    height: 44,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
  },
  row: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBorder: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_LIGHT,
  },
  checkBox: {
    paddingRight: 5,
    height: 22,
    width: 20,
  },
});

export default VendorList;
