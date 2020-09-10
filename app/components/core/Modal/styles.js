import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

export default StyleSheet.create({
  modalStyle: {
    height: 200, // doesn't work
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export const ModalContainer = styled.View`
`;

export const ModalHeader = styled.View`
  height: 45;
  flexDirection: row;
  borderBottomWidth: 0;
  borderBottomColor: #fff;
`;

export const ModalHeaderText = styled.Text`
  fontSize: 18;
  color: #fff;
  flexGrow: 1;
  textAlignVertical: center;
`;

export const CloseModalBtn = styled.TouchableOpacity`
`;

export const CloseModalIcon = styled.Image`
  height: 26;
  width: 26;
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
