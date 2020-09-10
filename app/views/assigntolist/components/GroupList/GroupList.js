import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, FlatList } from 'react-native';

// import GroupItem from './GroupItem';
import GroupRow from 'views/usermanagement/components/GroupRow';

import icons from 'constants/icons';
import { ViewHeaderContainer, ViewHeaderText } from './styles';

const ViewHeader = () => (
  <ViewHeaderContainer>
    <Image
      source={icons.tripsScreen.tripIconGroup}
      style={{ tintColor: '#fff' }}
    />
    <ViewHeaderText>Groups</ViewHeaderText>
  </ViewHeaderContainer>
);

class GroupsList extends Component {
  static propTypes = {
    data: PropTypes.array, // eslint-disable-line
    onGroupItemPress: PropTypes.func.isRequired,
  };

  renderItem = ({ item }) => {
    const disabled = item.status === 'I';
    return (
      <GroupRow
        key={item.dispatchGroupId}
        group={item}
        onPressItem={() => this.props.onGroupItemPress(item.dispatchGroupId)}
        chevron={false}
        disabled={disabled}
      />
    );
  };

  render() {
    const { data } = this.props;
    const extraData = {
      props: this.props,
    };

    return (
      <FlatList
        ListHeaderComponent={<ViewHeader />}
        data={data}
        extraData={extraData}
        keyExtractor={item => item.dispatchGroupId}
        renderItem={this.renderItem}
      />
    );
  }
}

export default GroupsList;
