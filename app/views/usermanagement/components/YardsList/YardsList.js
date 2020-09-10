// @flow

import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';

import Row from 'components/custom/List/ListRow';

import icons from 'constants/icons';

type Props = {
  yards: Array<Object>,
  onYardSelect: (yardNumber: number) => void,
  navigator: Object,
};

type YardRowProps = {
  yard: Object,
  onPress: (yardNumber: number) => void,
};

const YardRow = ({ yard, onPress }: YardRowProps) => (
  <TouchableOpacity onPress={() => onPress(yard.facility_id)}>
    <Row
      chevron={false}
      bottomBorder
      style={{ padding: 10 }}
    >
      <Text style={{ fontSize: 18, color: 'black' }}>Yard - {yard.facility_id}</Text>
    </Row>
  </TouchableOpacity>
);

export default class YardsList extends React.Component<Props> {
  static defaultProps = {
    yards: [],
  };

  static navigatorButtons = {
    leftButtons: [
      {
        icon: icons.tripsScreen.tripIconClose,
        id: 'closeModal',
      },
    ],
  };

  constructor(props: Props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = (event: Object) => {
    if (event.id === 'closeModal') {
      this.props.navigator.dismissModal({
        animationType: 'slide-down',
      });
    }
  };

  handlePress = (yardNumber: number) => {
    this.props.navigator.dismissModal({
      animationType: 'slide-down',
    });
    this.props.onYardSelect(yardNumber);
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.yards}
          renderItem={({ item }: Object) => (<YardRow
            yard={item}
            onPress={this.handlePress}
          />)}
          keyExtractor={(item: Object) => item.facility_id}
        />
      </View>
    );
  }
}
