import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';

import icons from 'constants/icons';

const CountryRow = ({ countryData: { countryName }, onCountrySelect }) => (
  <TouchableOpacity
    onPress={() => onCountrySelect(countryName)}
    style={{
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      padding: 15,
    }}
  >
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text
        style={{
          color: 'black',
          fontSize: 18,
        }}
      >
        {countryName}
      </Text>
      <Image source={icons.cellChevron} />
    </View>
  </TouchableOpacity>
);

CountryRow.propTypes = {
  onCountrySelect: PropTypes.func.isRequired,
  countryData: PropTypes.object.isRequired, // eslint-disable-line
};

export default CountryRow;
