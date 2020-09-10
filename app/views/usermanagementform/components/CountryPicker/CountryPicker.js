import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';

import colors from 'styles/colors';
import icons from 'constants/icons';

import CountryRow from '../CountryRow';

export default class CountryPicker extends Component {
  static navigatorStyle = {
    navBarBackgroundColor: colors.COPART_BLUE,
    navBarTextColor: colors.WHITE,
    navBarButtonColor: colors.WHITE,
    navBarNoBorder: true,
    screenBackgroundColor: colors.WHITE,
  };

  static navigatorButtons = {
    leftButtons: [
      {
        icon: icons.tripIconClose,
        id: 'closeModal',
      },
    ],
  };

  static propTypes = {
    navigator: PropTypes.object.isRequired, // eslint-disable-line
    dismissModal: PropTypes.func,
    onCountrySelect: PropTypes.func.isRequired,
    countryData: PropTypes.array.isRequired, // eslint-disable-line
  };

  static defaultProps = {
    dismissModal: x => x,
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'closeModal') {
        this.props.navigator.dismissModal();
      }
    }
  }

  handleCountrySelect = (value) => {
    this.props.onCountrySelect(value);
    this.props.navigator.dismissModal();
  };

  render() {
    const { countryData } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={countryData}
          renderItem={({ item }) => (
            <CountryRow
              countryData={item}
              onCountrySelect={this.handleCountrySelect}
            />
          )}
          style={{ margin: 0 }}
          keyExtractor={item => item.countryName}
        />
      </View>
    );
  }
}
