import { StyleSheet } from 'react-native';

const errorColor = '#b80000';
export default StyleSheet.create({
  errorBox: {
    backgroundColor: errorColor,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  successBox: {
    marginBottom: 5,
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  errorMessage: {
    color: 'white',
    padding: 8,
  },
});
