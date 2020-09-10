import { StyleSheet } from 'react-native';

import colors from 'styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(10, 8, 10, 0.78)',
    marginTop: 64,
  },
  innerContainer: {
    backgroundColor: 'white',
    paddingBottom: 10,
    maxHeight: 400,
  },
  header: {
    backgroundColor: colors.GRAY_DARK_1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  title: {
    padding: 2,
    color: colors.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 3,
  },
  buttonWrap: { flexDirection: 'row' },
  button: {
    marginRight: 10,
    color: colors.LIGHT_YELLOW,
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    height: 45,
    marginLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowSeparator: {
    height: 1,
    marginLeft: 10,
    backgroundColor: '#E2E5E8',
  },
});
