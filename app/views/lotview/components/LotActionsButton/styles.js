import styled from 'styled-components/native';
import colors from 'styles/colors';

export const ButtonContainer = styled.View`
  flex-direction: ${props => (props.status === 'accepted' ? 'row' : 'row-reverse')};
  align-self: stretch;
  height: 55;
  border-radius: 27.5;
  margin-vertical: 10;
  padding: 5px;
  background-color: ${props => (props.hasIssue ? colors.DISABLED : '#ddd')};
`;

export const RoundButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: 45;
  border-radius: 22.5;
  padding: 5px;
`;

export const BannerView = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: 45;
  padding: 5px;
`;
