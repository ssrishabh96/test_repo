import styled from 'styled-components/native';
import colors from '../../../styles/colors';

export const MessageBoxView = styled.View`
  justifyContent: center;
  alignSelf: stretch;
  marginLeft: 10;
  marginRight: 10;
  marginTop: 10;
  height: 80;
  borderColor: transparent;
  borderBottomWidth: 6;
  backgroundColor: ${props => colorMapper(props.type).backgroundColor};
  borderBottomColor: ${props => colorMapper(props.type).borderBottomColor};
`;

export const CenteredWhiteText = styled.Text`
  color: #fff;
  fontSize: 18;
  textAlign: center;
`;


const colorMapper = (type) => {
  switch (type) {
    case 'error':
      return {
        backgroundColor: 'red',
        borderBottomColor: '#7c0002',
      };
    case 'success':
      return {
        backgroundColor: '#01bd2e',
        borderBottomColor: '#006819',
      };
    default:
      return {
        backgroundColor: colors.COPART_BLUE,
        borderBottomColor: colors.COPART_BLUE,
      };
  }
};
