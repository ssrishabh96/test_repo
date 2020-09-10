import { StyleSheet } from 'react-native';

import colors from 'styles/colors';
import responsiveStyle from 'styles/responsiveStyles';

export const rs = StyleSheet.create(responsiveStyle);

export const styles = StyleSheet.create({
  syncStyles: {
    width: 35,
    height: 65,
  },
  gridStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontStyles: {
    color: colors.GRAY_DARK,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  textStyle: {
    color: colors.COPART_BLUE,
    fontSize: 20,
    padding: '4%',
    textAlign: 'right',
    elevation: 50,
    backgroundColor: colors.GRAY_LIGHT,
  },
  grid: { flex: 1, flexDirection: 'column' },
  row: { flex: 1, flexDirection: 'row' },
});
