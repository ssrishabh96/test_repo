// @flow
import { RNNavigator } from 'types/RNNavigation';

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import icons from 'constants/icons';
import { Navigation } from 'react-native-navigation';
import { defaultNavStyles } from 'styles';

type NotesBlockProp = {
  title: string,
  note: string,
};
const NotesBlock = ({ title, note }: NotesBlockProp) => (
  <View style={{ marginTop: 10 }}>
    <Text style={{ color: '#005abc', fontWeight: 'bold', fontSize: 14 }}>{title}</Text>
    <Text style={{ paddingLeft: 5 }}>{note}</Text>
  </View>
);

type PickupNotesProps = {
  navigator: RNNavigator,
  notes: Array<NotesBlockProp>,
};

class PickupNotes extends React.Component<PickupNotesProps> {
  static navigatorStyle = defaultNavStyles;
  static navigatorButtons = {
    leftButtons: [
      {
        id: 'closeNotes',
        icon: icons.tripIconClose,
        title: 'close',
      },
    ],
  };
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  onNavigatorEvent = (event) => {
    if (event.id === 'closeNotes') {
      Navigation.dismissModal({
        animationType: 'slide-down',
      });
    }
  };
  render() {
    const { notes } = this.props;
    return (
      <ScrollView
        style={{ backgroundColor: 'white' }}
        contentContainerStyle={{ padding: 20 }}
      >
        {notes.map(({ title, note }: NotesBlockProp) => (<NotesBlock
          title={title}
          note={note}
        />))}
      </ScrollView>
    );
  }
}
export default PickupNotes;
