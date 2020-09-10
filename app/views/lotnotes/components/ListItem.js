import React from 'react';
import { View, Text } from 'react-native';
import Row from 'components/custom/List/ListRow/Row';
import colors from 'styles/colors';

type Props = {
  note: {
    user_id: string,
    createTime: string,
    notes: string,
  },
  isEvenRow: boolean,
};

const formatDate = date => (date.isValid() ? date.format('MM/DD/YYYY HH:mm:ss') : date);

const NoteItem = ({ note, isEvenRow }: Props) => (
  <Row style={[styles.rowStyle, isEvenRow ? styles.even : styles.odd]}>
    <View style={[{ flexDirection: 'row', justifyContent: 'flex-end' }]}>
      {/* <Text style={[styles.textStyle, styles.userName]}>{note.user_id}</Text> */}
      <Text style={[styles.textStyle, styles.date]}>{formatDate(note.createTime)}</Text>
    </View>
    <Text style={[styles.textStyle, styles.note]}>{note.notes}</Text>
  </Row>
);
const styles = {
  rowStyle: {
    minHeight: 100,
  },
  even: {
    backgroundColor: '#fff',
  },
  odd: {
    backgroundColor: '#d7d7d7',
  },
  textStyle: {
    paddingTop: 5,
    fontSize: 14,
  },
  date: {
    color: colors.TEXT_DARK,
    textAlign: 'right',
    paddingRight: 10,
  },
  userName: {
    color: colors.COPART_BLUE,
    fontWeight: 'bold',
    fontSize: 15,
    paddingLeft: 10,
  },
  note: {
    color: 'black',
    padding: 10,
  },
};

export default NoteItem;
