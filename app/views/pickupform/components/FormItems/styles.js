import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';
import colors from 'styles/colors';

export const formStyles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.TEXT_DARK,
  },
  value: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.TEXT_LIGHT,
  },
});
export const formNoteStyles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: colors.TEXT_DARK,
    backgroundColor: colors.GRAY_2,
    padding: 5,
    top: -20,
  },
  value: {
    fontSize: 10,
    color: colors.TEXT_LIGHT,
  },
});

export const ButtonContainer = styled.View`
  flex-direction: ${props => (props.status === 'accepted' ? 'row' : 'row-reverse')};
  align-self: stretch;
  height: 55;
  border-radius: 27.5;
  margin-vertical: 20;
  padding: 5px;
  background-color: #ddd;
`;

export const RoundButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: 45;
  border-radius: 22.5;
  padding: 5px;
`;
