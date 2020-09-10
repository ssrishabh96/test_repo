import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';
import colors from 'styles/colors';

// TODO: Pass props to adjust `top` and `right` for different icon sizes

export const Badge = styled.View`
  position: absolute;
  top: 6;
  right: 55;
  background-color: #f44336;
  height: 24;
  min-width: 24;
  border-radius: 12;
  align-items: center;
  padding: 1.5px;
  justify-content: center;
`;

export const TabContainer = styled.View`
  background-color: ${({ focused }) => (focused ? '#444' : '#ddd')};
  flex: 1;
  padding-top: 10px;
  padding-right: 10px;
  align-self: stretch;
  align-items: center;
  justify-content: center;
`;

export const TabLabel = styled.Text`
  color: ${props => (props.focused ? '#fff' : 'black')};
  font-weight: bold;
`;

export const TextCount = styled.Text`
  color: #fff;
  font-size: 12;
  font-weight: bold;
`;

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: colors.COPART_BLUE,
    height: 6,
  },
  tabbar: {
    backgroundColor: '#ddd',
    height: 54,
  },
  tabStyle: {
    height: 48,
    flex: 1,
    padding: 0,
  },
});

export default styles;
