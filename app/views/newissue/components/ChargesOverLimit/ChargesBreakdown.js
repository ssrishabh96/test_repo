/**
 * @flow
 */

import type { BreakdownItemType } from './types';

import React, { Component } from 'react';
import { View } from 'react-native';

import BreakdownItem from './BreakdownItem';

type Props = {
  breakdownItems: Array<BreakdownItemType>,
  onAddChargeBreakdown: (chargeType: string, chargeValue: string) => void,
  onRemoveChargeBreakdown: (index: number) => void,
  updateValue: (breakdownItem: Object, newVal: string, updateNumber: boolean) => void,
  navigator: Object,
};

class ChargesBreakdown extends Component<Props> {
  render() {
    return (
      <View>
        {this.props.breakdownItems.map((breakdownItem: Object) => (
          <BreakdownItem
            key={breakdownItem.index}
            navigator={this.props.navigator}
            updateValue={this.props.updateValue}
            breakdownItem={breakdownItem}
            onAddChargeBreakdown={this.props.onAddChargeBreakdown}
            onRemoveChargeBreakdown={this.props.onRemoveChargeBreakdown}
          />
        ))}
      </View>
    );
  }
}

export default ChargesBreakdown;
