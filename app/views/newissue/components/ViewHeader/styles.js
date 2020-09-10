import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: 75,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    height: 75,
    width: 120,
  },
});

export const ViewHeader = styled.View`
  height: 45;
  background-color: #ee2727;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 10px;
  padding-vertical: 5px;
`;
