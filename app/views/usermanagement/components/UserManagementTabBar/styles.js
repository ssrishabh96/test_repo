import { StyleSheet } from 'react-native';
import colors from 'styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: colors.COPART_BLUE,
    alignItems: 'stretch',
  },
  tab: {
    // width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    backgroundColor: '#FAEBD7',
  },
});
