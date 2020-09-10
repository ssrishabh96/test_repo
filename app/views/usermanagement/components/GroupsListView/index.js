import React from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';

import { LoadingIndicator } from 'styles';
import GroupRow from '../GroupRow';

const GroupsListView = ({ data, onItemPress, isLoading }) => (
  <View style={{ flex: 1 }}>
    {isLoading ? (
      <LoadingIndicator size="large" />
    ) : (
      <FlatList
        data={data}
        renderItem={({ item }) => (<GroupRow
          group={item}
          onPressItem={onItemPress}
        />)}
        keyExtractor={item => item.dispatchGroupId}
      />
    )}
  </View>
);

GroupsListView.propTypes = {
  data: PropTypes.array.isRequired, // eslint-disable-line
  isLoading: PropTypes.bool.isRequired,
  onItemPress: PropTypes.func.isRequired,
};

export default GroupsListView;
