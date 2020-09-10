import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import Locale from 'utils/locale';
import colors from '../../../../styles/colors';
import styles from './styles';
import icons from 'constants/icons';

type Props = {
  filter: string,
  multiselect: boolean,
  filterData: Function,
  clearFilter: Function,
};
export default ({ filter, filterData, clearFilter, multiselect }: Props) => (
  <View style={styles.searchDarkBackground}>
    <Image
      source={icons.tripsScreen.tripIconSearch}
      style={styles.searchIcon}
    />
    <View style={styles.searchLightBackground}>
      <TextInput
        onChangeText={filterData}
        value={filter}
        style={styles.searchInput}
        placeholder={Locale.translate('PickupForm.childData.Search')}
        returnKeyType={'search'}
        underlineColorAndroid="transparent"
      />
      <TouchableOpacity
        onPress={() => {
          clearFilter();
        }}
      >
        {filter !== '' ? (
          <Icon
            size={18}
            name={'times-circle'}
            color={colors.TEXT_LIGHT}
            style={styles.clearInput}
          />
        ) : null}
      </TouchableOpacity>
    </View>
    <Text style={styles.header}>
      {multiselect
        ? Locale.translate('PickupForm.childData.SelectMulti')
        : Locale.translate('PickupForm.childData.SelectOne')}
    </Text>
  </View>
);
