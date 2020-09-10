import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

import colors from 'styles/colors';

export const RoundButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: 45;
  border-radius: 20;
  padding: 5px;
`;

export const FormContainer = styled.View`
  margin: 5px;
  padding: 10px;
`;

export const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  margin50: { marginBottom: 50 },
  label: { paddingBottom: 20, color: colors.COPART_BLUE },
  button: {
    marginVertical: 7,
    borderRadius: 25,
  },
});
