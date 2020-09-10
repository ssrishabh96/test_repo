import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

import colors from 'styles/colors';

const DATA = [
  {
    id: 1,
    charge: 'Tow',
  },
  {
    id: 2,
    charge: 'Labor',
  },
  {
    id: 3,
    charge: 'Yard/Gate',
  },
  {
    id: 4,
    charge: 'Storage',
  },
  {
    id: 5,
    charge: 'Flat/Negotiated Storage',
  },
  {
    id: 6,
    charge: 'Teardown/Estimating Fee',
  },
  {
    id: 7,
    charge: 'Miscellaneous',
  },
  {
    id: 8,
    charge: 'Tax',
  },
];

type Props = {
  onChargeSelect: (charge: string, id: number) => void,
};

export default class ChargePickerList extends React.Component<Props> {
  static navigatorStyle = {
    navBarBackgroundColor: colors.COPART_BLUE,
    navBarTextColor: '#fff',
    navBarButtonColor: '#fff',
    navBarNoBorder: true,
  };

  renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ padding: 15 }}
      onPress={() => this.props.onChargeSelect(item.charge)}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, color: 'black' }}>{item.charge}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <FlatList
          data={DATA}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 1.0, backgroundColor: 'gray' }} />}
        />
      </View>
    );
  }
}
