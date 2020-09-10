import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

type Styles = Object;

const styles: Styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 4,
    color: colors.COPART_BLUE,
    paddingVertical: 14,
  },
  submitBtn: {
    margin: 20,
  },
});

export default styles;
