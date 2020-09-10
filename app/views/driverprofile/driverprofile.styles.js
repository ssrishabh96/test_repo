import { StyleSheet } from 'react-native';
import colors from 'styles/colors';

export default StyleSheet.create({
  container: { flex: 1, padding: 10 },
  greyLabel: { color: '#545a63', fontSize: 16, fontWeight: 'bold' },
  fontSize16: { fontSize: 16 },
  whiteBoldText16: { fontSize: 16, color: colors.WHITE, fontWeight: 'bold' },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
  userImage: {
    borderColor: colors.WHITE,
    borderRadius: 55,
    borderWidth: 2,
    height: 110,
    marginBottom: 15,
    width: 110,
  },
});
