// @flow

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = styled.View`
  height: 45;
  background-color: #ee2727;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 10px;
  padding-vertical: 5px;
`;

export default class ViewHeader extends Component<> {
  render() {
    return (
      <View>
        <Header>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>Issues:</Text>
          <Icon
            name={'exclamation-circle'}
            color={'white'}
            size={28}
          />
        </Header>
      </View>
    );
  }
}
