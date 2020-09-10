import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';

import icons from 'constants/icons';

const StateRow = ({ stateData: { name }, onStateSelect }) => (
  <TouchableOpacity
    onPress={() => onStateSelect(name)}
    style={{
      borderBottomColor: '#e2e5e8',
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
        {name}
      </Text>
      <Image source={icons.cellChevron} />
    </View>
  </TouchableOpacity>
);

StateRow.propTypes = {
  onStateSelect: PropTypes.func.isRequired,
  stateData: PropTypes.object.isRequired, // eslint-disable-line
};

export default StateRow;
