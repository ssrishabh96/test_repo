import React, { Component } from 'react';
import { ScrollView, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import renderIf from 'render-if';

import DriverRow from './components/DriverRow';

import icons from 'constants/icons';
import { defaultNavStyles, LoadingIndicator } from 'styles';

class GroupsDriversListView extends Component {
  static propTypes = {
    personnel: PropTypes.array.isRequired, // eslint-disable-line
    navigator: PropTypes.any, // eslint-disable-line
    isLoading: PropTypes.bool.isRequired,
    dispatchGroupId: PropTypes.number.isRequired,
  };
  static navigatorStyle = {
    ...defaultNavStyles,
    navBarSubtitleColor: '#fff',
    navBarSubtitleFontSize: 15,
  };

  static navigatorButtons = {
    leftButtons: [
      {
        icon: icons.tripsScreen.tripIconClose,
        id: 'back',
      },
    ],
  };

  constructor(props: any) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = (event: Object) => {
    if (event.id === 'back') {
      this.props.navigator.dismissModal();
    }
  };

  renderItem = ({ item }) => (
    <DriverRow
      onPressItem={null}
      chevron={false}
      key={item.vendorPersonnelId}
      driver={item}
      showRole
    />
  );

  render() {
    const extraData = {
      props: this.props,
    };
    const { personnel, isLoading } = this.props;
    const renderIfIsLoading = renderIf(isLoading);
    const renderIfNotIsLoading = renderIf(!isLoading);
    return (
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        {renderIfIsLoading(<LoadingIndicator size="large" />)}
        {renderIfNotIsLoading(
          <FlatList
            data={personnel}
            extraData={extraData}
            keyExtractor={item => item.vendorPersonnelId}
            renderItem={this.renderItem}
          />,
        )}
      </ScrollView>
    );
  }
}

export default GroupsDriversListView;
