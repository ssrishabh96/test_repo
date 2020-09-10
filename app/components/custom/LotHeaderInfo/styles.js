import { StyleSheet } from 'react-native';

import colors from 'styles/colors';

export default StyleSheet.create({
  container: {
    minHeight: 75,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    minHeight: 75,
    width: 120,
    backgroundColor: colors.GRAY_2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
