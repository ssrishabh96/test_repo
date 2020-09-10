import { StyleSheet } from 'react-native';
import colors from 'styles/colors';

export default StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    height: 44,
    backgroundColor: colors.GRAY_DARK_1,
    alignItems: 'center',
  },
  textInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    margin: 3,
    padding: 5,
    backgroundColor: 'white',
  },
  button: {
    marginHorizontal: 10,
  },
  cancel: {
    fontSize: 18,
    color: colors.LIGHT_YELLOW,
  },
  searchIcon: {
    marginHorizontal: 5,
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
});
