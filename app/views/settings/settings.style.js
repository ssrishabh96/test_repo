import { StyleSheet } from 'react-native';

import COLOR from 'styles/colors';

const styles = StyleSheet.create({
  flatListKeyItemStyle: {
    flex: 1,
    fontSize: 15,
    textAlign: 'left',
    justifyContent: 'center',
  },
  flatListValueItemStyle: {
    fontSize: 15,
    paddingRight: 5,
    color: COLOR.COPART_BLUE,
  },
  flatListCenteredItemStyle: {
    fontSize: 15,
    textAlign: 'center',
    flex: 1,
    color: COLOR.COPART_BLUE,
  },
  button: {
    backgroundColor: COLOR.COPART_BLUE,
    padding: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  flexDirectionRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  itemWrapper: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flex: 1,
    height: 50,
    alignItems: 'center',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GRAY_LIGHT,
    paddingLeft: 10,
    paddingRight: 5,
  },
});
export default styles;

// XX styles.flexDirectionRow,
