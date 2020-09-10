// @flow

import type { Lot } from 'types/Lot';
import type { Trip } from 'types/Trip';

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import renderIf from 'render-if';
import Icon from 'react-native-vector-icons/FontAwesome';

import LotHeaderInfo from 'components/custom/LotHeaderInfo';
import { ViewHeader as Header } from './styles';

type Props = {
  entity: string,
  headerText: string,
  issueText?: string,
  data: Lot | Trip,
};

export default class ViewHeader extends Component<Props> {
  render() {
    const { headerText, data, entity, issueText = 'Unable to Pickup' } = this.props;
    const renderIfEntityIsLot = renderIf(entity === 'lot');
    return (
      <View>
        <View style={{ padding: 10, backgroundColor: '#323742' }}>
          <Text style={{ color: '#fefefe' }}>{headerText}</Text>
        </View>
        {renderIfEntityIsLot(
          <LotHeaderInfo
            lot={data}
            // $FlowFixMe
            vehicleType={data.vehicleType || 'N/A'}
          />,
        )}
        <Header>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>{issueText}</Text>
          <Icon
            name={'exclamation-circle'}
            color={'white'}
            size={25}
          />
        </Header>
      </View>
    );
  }
}
