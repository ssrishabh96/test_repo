import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

export default StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    alignSelf: 'stretch',
  },
  textInput: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1.0,
    borderColor: 'black',
    width: 100,
    height: 40,
    textAlign: 'center',
  },
  selectIssueStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 45,
    width: 140,
    borderBottomWidth: 1.0,
    borderBottomColor: 'black',
    paddingHorizontal: 20,
  },
  roundButton: {
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingBottom: 0,
    backgroundColor: '#005abc',
  },
});

export const RowView = styled.View`
  flex-direction: row;
`;
