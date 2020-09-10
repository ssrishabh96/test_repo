import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, FlatList } from 'react-native';

import DriverRow from 'views/usermanagement/components/DriverRow';

import { ViewHeaderContainer, ViewHeaderText } from './styles';
import icons from 'constants/icons';

const ViewHeader = () => (
  <ViewHeaderContainer>
    <Image
      source={icons.tripsScreen.tripIconDriver}
      style={{ tintColor: '#fff' }}
    />
    <ViewHeaderText>Drivers</ViewHeaderText>
  </ViewHeaderContainer>
);

class DriverList extends Component {
  static propTypes = {
    data: PropTypes.array, // eslint-disable-line
    onDriverItemPress: PropTypes.func.isRequired,
  };

  renderItem = ({ item }) => {
    const disabled = item.status === 'I';
    return (
      <DriverRow
        onPressItem={() => this.props.onDriverItemPress(item.vendorPersonnelId)}
        chevron={false}
        key={item.vendorPersonnelId}
        driver={item}
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
        keyExtractor={item => item.vendorPersonnelId}
        renderItem={this.renderItem}
      />
    );
  }
}

export default DriverList;
