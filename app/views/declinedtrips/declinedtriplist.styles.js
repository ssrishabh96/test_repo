import { StyleSheet } from 'react-native';
import colors from 'styles/colors';
import styled from 'styled-components/native';

export const Badge = styled.View`
  position: absolute;
  top: 6;
  right: ${props => (props.routeKey === 'raised' ? 10 : 14)};
  background-color: ${colors.DARK_RED};
  height: 24;
  min-width: 24;
  border-radius: 12;
  align-items: center;
  justify-content: center;
`;

export const TextCount = styled.Text`
  color: #fff;
  font-size: 12;
  font-weight: bold;
  margin-top: -2;
`;

export const TabContainer = styled.View`
  background-color: ${props => (props.focused ? '#444' : '#ddd')};
  flex: 1;
  align-self: stretch;
  align-items: center;
  justify-content: center;
`;

export const TabLabel = styled.Text`
  color: ${props => (props.focused ? '#fff' : 'black')};
  font-weight: bold;
`;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#ddd',
    height: 54,
  },
  tab: {
    height: 48,
    flex: 1,
    padding: 0,
  },
  indicator: {
    backgroundColor: colors.COPART_BLUE,
    height: 6,
  },
});
