import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';
import colors from 'styles/colors';

export const Badge = styled.View`
  position: absolute;
  top: 6;
  right: ${props => (props.routeKey === 'trips' ? 52 : 55)};
  background-color: ${colors.DARK_RED};
  height: 24;
  min-width: 24;
  border-radius: 12;
  align-items: center;
  padding: 1.5px;
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
  labelContainer: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unfocusedTab: {
    backgroundColor: '#ddd',
  },
  focusedTab: {
    backgroundColor: '#444',
  },
  labelStyle: {
    fontWeight: 'bold',
  },
  unfocusedLabel: {
    color: 'black',
  },
  focusedLabel: {
    color: 'white',
  },
});

export default styles;
