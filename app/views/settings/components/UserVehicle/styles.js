import { StyleSheet } from 'react-native';

import colors from 'styles/colors';

const styles = StyleSheet.create({
  textStyle: {
    color: colors.COPART_BLUE,
    fontSize: 20,
    padding: 5,
    textAlign: 'right',
    backgroundColor: colors.GRAY_LIGHT,
  },
  iosPickerStyle: {
    flex: 1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'flex-end',
    flexDirection: 'column',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default styles;
