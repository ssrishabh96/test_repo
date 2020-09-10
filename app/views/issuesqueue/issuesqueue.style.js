import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

export const ViewHeader = styled.View`
  height: 45;
  background-color: ${colors.DARK_RED};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 10px;
  padding-vertical: 5px;
`;

export const Badge = styled.View`
  position: absolute;
  top: 4;
  right: ${(props) => {
    if (props.routeKey === 'raised') {
      return 13;
    } else if (props.routeKey === 'assigned') {
      return 15;
    }
    return 20;
  }};
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
  flex-wrap: wrap;
  width: 75;
  font-weight: bold;
  text-align: center;
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
