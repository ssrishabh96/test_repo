// @flow
/* eslint-disable no-alert */

import type { BreakdownItemType } from './types';
import type { RNNNavigator } from 'types/RNNavigation';

import React, { Component } from 'react';
import { TouchableOpacity, Text, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Locale from 'utils/locale';
import icons from 'constants/icons';
import styles, { RowView } from './styles';

type Props = {
  onAddChargeBreakdown: (currentChargeType: string, currentChargeValue: string) => void,
  onRemoveChargeBreakdown?: (index: number) => void,
  breakdownItem?: BreakdownItemType,
  updateValue?: (breakdownItem: BreakdownItemType, newVal: string, updateNumber: boolean) => void,
  setCurrentChargeType?: (chargeType: string) => void,
  setCurrentChargeValue?: (chargeValue: string) => void,
  currentChargeType?: string | number,
  currentChargeValue?: string | number,
  navigator: RNNNavigator,
};

class BreakdownItem extends Component<Props> {
  handleOnChargeSelect = (charge: string) => {
    if (this.props.breakdownItem) {
      // Following line written to fix flow linting error
      if (typeof this.props.updateValue === 'function') {
        // check "type Props" for function signature
        this.props.updateValue(this.props.breakdownItem, charge, false);
      }
    } else if (typeof this.props.setCurrentChargeType === 'function') {
      // check "type Props" for function signature
      this.props.setCurrentChargeType(charge);
    }
    this.props.navigator.pop();
  };

  handleOnPressSelectChargeType = () => {
    this.props.navigator.push({
      title: 'Pick Charge',
      screen: 'CopartTransporter.ChargesOverLimitChargePicker',
      passProps: {
        onChargeSelect: (charge: string) => this.handleOnChargeSelect(charge),
      },
    });
  };

  render() {
    const { currentChargeType, currentChargeValue } = this.props;
    const {
      breakdownItem,
      updateValue,
      onRemoveChargeBreakdown,
      onAddChargeBreakdown,
    } = this.props;

    return (
      <RowView
        style={{
          marginTop: 20,
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          style={styles.selectIssueStyle}
          onPress={this.handleOnPressSelectChargeType}
        >
          <Text style={{ textAlign: 'center', flex: 2, fontSize: 16, color: 'black' }}>
            {(breakdownItem && breakdownItem.chargeType) ||
              currentChargeType ||
              Locale.translate('newIssue.chargesOverLimit.selectCharge')}
          </Text>
          <Image
            source={icons.dropDownIcon}
            style={{
              height: 24,
              width: 24,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </TouchableOpacity>
        <TextInput
          placeholder={'$00.00'}
          returnKeyType="done"
          keyboardType="numeric"
          style={styles.textInput}
          value={
            (breakdownItem && `$${breakdownItem.chargeValue}`) ||
            (currentChargeValue === '' || !currentChargeValue ? '' : `$${currentChargeValue}`)
          }
          onChangeText={(newVal: string) =>
            breakdownItem
              ? typeof updateValue === 'function' && updateValue(breakdownItem, newVal, true)
              : typeof this.props.setCurrentChargeValue === 'function' &&
                this.props.setCurrentChargeValue(newVal)
          }
          underlineColorAndroid="transparent"
        />
        {breakdownItem ? (
          <TouchableOpacity
            onPress={() =>
              typeof onRemoveChargeBreakdown === 'function' &&
              onRemoveChargeBreakdown(breakdownItem.index)
            }
            style={styles.roundButton}
          >
            <Icon
              name={'minus'}
              color={'#fff'}
              size={22}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              typeof onAddChargeBreakdown === 'function' &&
              // $FlowFixMe
              onAddChargeBreakdown(currentChargeType, currentChargeValue)
            }
            style={styles.roundButton}
          >
            <Icon
              name={'plus'}
              color={'#fff'}
              size={22}
            />
          </TouchableOpacity>
        )}
      </RowView>
    );
  }
}

export default BreakdownItem;
