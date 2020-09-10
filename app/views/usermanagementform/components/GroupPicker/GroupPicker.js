import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';

import GroupRow from 'views/usermanagement/components/GroupRow';

import colors from 'styles/colors';
import icons from 'constants/icons';

export default class NewDriverGroupPicker extends Component {
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
        icon: icons.tripsScreen.tripIconClose,
        id: 'closeModal',
      },
    ],
  };

  static propTypes = {
    navigator: PropTypes.object.isRequired, // eslint-disable-line
    dismissModal: PropTypes.func,
    onGroupSelect: PropTypes.func.isRequired,
    groupData: PropTypes.array.isRequired, // eslint-disable-line
  };

  static defaultProps = {
    dismissModal: x => x,
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.id === 'closeModal') {
      this.props.navigator.dismissModal();
    }
  }

  handlePressItem = (dispatchGroupId) => {
    const group = this.props.groupData.find(g => g.dispatchGroupId === dispatchGroupId);
    if (group) {
      this.props.onGroupSelect(group.name);
      this.props.navigator.dismissModal();
    } else {
      this.props.navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: 'Some problem choosing the group. Please try again.',
        },
        autoDismissTimerSec: 2.0,
      });
    }
  };

  render() {
    const { groupData } = this.props;
    return (
      <View>
        <FlatList
          data={groupData}
          renderItem={({ item }) => (<GroupRow
            group={item}
            onPressItem={this.handlePressItem}
          />)}
          keyExtractor={item => item.dispatchGroupId}
        />
      </View>
    );
  }
}
