import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';
import colors from 'styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  textInput: {
    borderWidth: 1,
    // borderRadius: 4,
    color: colors.COPART_BLUE,
    paddingVertical: 14,
  },
  submitBtn: {
    margin: 20,
  },
});

export const ModalContainer = styled.View`
`;

export const ModalHeader = styled.View`
  height: 75;
  flexDirection: row;
  borderBottomWidth: 0;
  justifyContent: center;
  alignItems: center;
`;
// borderBottomColor: #fff;

export const ModalHeaderText = styled.Text`
  fontSize: 18;
  color: #fff;
  flexGrow: 1;
  textAlignVertical: center;
`;

export const CloseModalBtn = styled.TouchableOpacity`
  height: 16;
  width: 16;
`;

export const CloseModalIcon = styled.Image`
  height: 26;
  width: 26;
  flexGrow: 1;
`;

export const FormContainer = styled.View`
  margin: 5px;
  padding: 10px;
`;

export const FormInput = styled.TextInput`
  height: 40;
  borderBottomWidth: 1;
  borderBottomColor: #005abc;
  color: #005abc;
`;

