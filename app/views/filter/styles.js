import { StyleSheet, Platform } from 'react-native';
import colors from 'styles/colors';

export default StyleSheet.create({
  categoryColor: {
    width: '45%',
    backgroundColor: colors.GRAY_2,
  },
  activeCategory: {
    backgroundColor: '#a6a6a6',
  },
  categoryButton: {
    padding: 6,
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_DARK_1,
  },
  categoryText: {
    flex: 1,
    color: colors.GRAY_DARK_1,
    fontWeight: 'bold',
    fontSize: 18,
    borderBottomColor: '#cccccc',
  },
  rowOptions: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  checkBox: { paddingRight: 5 },
  valueWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    color: colors.GRAY_DARK_1,
    flex: 1,
  },
  valueCount: {
    fontSize: 16,
    color: colors.GRAY_DARK_1,
    textAlign: 'right',
  },
  buttonText: {
    color: colors.LIGHT_YELLOW,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  title: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    backgroundColor: colors.COPART_BLUE,
  },
  headerView: {
    backgroundColor: colors.GRAY_DARK_1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 45,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  topButtons: {
    top: 30,
    padding: 2,
  },
  headerText: {
    padding: 2,
    color: colors.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 3,
  },
  badgeView: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: colors.LIGHT_YELLOW,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  navbar: {
    height: Platform.OS === 'ios' ? 65 : 60,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    paddingHorizontal: 10,
    flexDirection: 'row',
    backgroundColor: colors.COPART_BLUE,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navbarButton: { color: 'white' },
  navbarTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
    ...(Platform.OS === 'android' ? { flex: 1, textAlign: 'left', paddingLeft: 20 } : {}),
  },
});
