import { StyleSheet } from 'react-native';
import colors from 'styles/colors';

export default StyleSheet.create({
  searchDarkBackground: {
    flexDirection: 'row',
    backgroundColor: colors.GRAY_DARK_1,
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  searchLightBackground: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    marginRight: 10,
  },
  searchIcon: {
    height: 18,
    width: 18,
    marginRight: 10,
    resizeMode: 'contain',
  },
  searchInput: {
    flex: 1,
    padding: 5,
  },
  clearInput: {
    marginRight: 5,
  },
  header: { color: 'yellow', fontSize: 14 },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  highlightedLetter: { color: '#248', fontWeight: 'bold' },
  letterStyle: { color: 'gray' },
  saveContainer: { height: 65, padding: 10 },
  saveButton: {
    height: 45,
    borderRadius: 50,
    backgroundColor: '#123abc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: { color: 'white', fontWeight: 'bold' },
});
