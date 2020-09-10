import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../../../styles/colors';

type Props = {
  code: string,
  description: string,
  hexcode: string | undefined,
  onPress: Function,
  selected: boolean,
};
export default function ListItem({ code, description, hexcode, onPress, selected }: Props) {
  return (
    <TouchableOpacity onPress={() => onPress(code)}>
      <View style={styles.itemContainer}>
        <View style={styles.descriptionContainer}>
          {hexcode && (
            <View
              style={[
                styles.hexCode,
                {
                  backgroundColor: hexcode,
                  borderColor: hexcode === '#FFFFFF' ? 'black' : hexcode,
                },
              ]}
            />
          )}
          <Text style={styles.description}>{description}</Text>
        </View>
        {selected && (
          <Icon
            size={22}
            name={'check'}
            color={colors.TEXT_DARK}
            style={styles.check}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    borderColor: '#EBEBEB',
    borderBottomWidth: 1,
  },
  descriptionContainer: {
    flex: 1,
    height: 40,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hexCode: {
    marginRight: 10,
    width: 50,
    height: 30,
    borderRadius: 8,
    borderWidth: 2,
  },
  description: { fontSize: 15, fontWeight: 'bold', color: colors.TEXT_LIGHT },
  check: { paddingRight: 10, paddingTop: 10, marginRight: 20 },
});
