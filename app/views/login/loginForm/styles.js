import { StyleSheet } from 'react-native';
import colors from 'styles/colors';

const errorColor = '#b80000';
export default StyleSheet.create({
  formContainer: { flex: 1, marginVertical: 30, justifyContent: 'center' },
  textInput: {
    color: 'white',
    height: 40,
    marginTop: 15,
    borderBottomWidth: 1,
    borderColor: 'white',
    paddingLeft: 10,
  },
  forgotWraper: { alignItems: 'flex-start', marginTop: 5 },
  forgotText: {
    paddingVertical: 10,
    paddingRight: 10,
    color: colors.LIGHT_YELLOW,
    textDecorationLine: 'underline',
  },
  submit: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 30,
  },
  submitText: { fontSize: 20, fontWeight: 'bold' },
  disabledSubmit: {
    backgroundColor: colors.GRAY_1,
  },
  errorInput: {
    borderBottomColor: errorColor,
    borderBottomWidth: 2,
  },
  errorText: {
    fontSize: 15,
    color: errorColor,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingLeft: 5,
  },
  errorBox: {
    backgroundColor: errorColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  successBox: {
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  errorMessage: {
    color: 'white',
  },
});
