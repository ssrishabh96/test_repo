import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';

import StateRow from '../../components/StateRow';

import colors from 'styles/colors';
import icons from 'constants/icons';

export default class StatePicker extends Component {
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
    onStateSelect: PropTypes.func.isRequired,
    stateData: PropTypes.array.isRequired, // eslint-disable-line
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

  handleStateSelect = (value) => {
    this.props.onStateSelect(value);
    this.props.navigator.dismissModal();
  };

  render() {
    const { stateData } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={stateData}
          renderItem={({ item }) => (
            <StateRow
              stateData={item}
              onStateSelect={this.handleStateSelect}
            />
          )}
          style={{ margin: 0 }}
          keyExtractor={item => item.code}
        />
      </View>
    );
  }
}
