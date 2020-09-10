/**
 * @flow
 */

/* eslint-disable no-alert */

import type { ContainerState as State, ChargeBreakDownItem } from './types';

import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import { find, findIndex, propEq, keys } from 'ramda';

import Button from 'components/core/Button';
import ChargesDueForClearance from './ChargesDueForClearance';
import ChargesBreakdown from './ChargesBreakdown';
import BreakdownItem from './BreakdownItem';
import ErrorBox from './ErrorBox';

import { reverseChargeMapper } from 'utils/mappers/chargesBreakdownMapper';
import Locale from 'utils/locale';
import styles, { RowView } from './styles';
import { onlyNumbers } from 'utils/commonUtils';

const parseCharges = (differenceBreakdown: Array<ChargeBreakDownItem>) => {
  const parsedData = differenceBreakdown.reduce((acc: Object, current: Object) => {
    const key = reverseChargeMapper[current.chargeType] || current.chargeType;
    const value = current.chargeValue;

    return {
      ...acc,
      [key]: value,
    };
  }, {});
  return parsedData;
};

class ChargesOverLimit extends Component<*, State> {
  state = {
    currentChargeType: '',
    currentChargeValue: '',
    chargesAskedByLocation: '',
    differenceBreakdown: [],
    showChargesDueBreakdown: false,
    comment: '',
    error: { message: null },
  };

  setCurrentChargeType = (chargeType: string) => {
    this.setState({
      currentChargeType: chargeType,
    });
  };

  setCurrentChargeValue = (charge: string) => {
    // if (charge === '' || charge === '$') {
    //   this.setState({
    //     currentChargeValue: '',
    //   });
    //   return;
    // }
    const newCharge = onlyNumbers(charge);

    if (newCharge === '' || newCharge === null || newCharge === undefined) {
      alert('Please enter a valid value greater than $0');
      this.setState({
        currentChargeValue: '',
      });
      return;
    }

    // if (parseFloat(newCharge) >= 0) {
    //   this.setState({
    //     currentChargeValue: newCharge, // newCharge.toString(),
    //   });
    // }
    if (parseFloat(newCharge) >= 0) {
      this.setState({
        currentChargeValue: newCharge,
      });
    }
  };

  setError = (message: string) => {
    this.setState(
      {
        error: {
          message,
        },
      },
      () => {
        setTimeout(() => this.setState({ error: { message: null } }), 5000);
      },
    );
  };

  validateCharges = (): boolean => {
    const {
      chargesAskedByLocation: locationCharges,
      differenceBreakdown,
      currentChargeType,
      currentChargeValue,
    } = this.state;

    let currentTotal = 0;

    let flag = false;
    currentTotal += differenceBreakdown.reduce(
      (runningTotal: number, currentObj: ChargeBreakDownItem) => {
        const val = parseFloat(onlyNumbers(currentObj.chargeValue));
        if (val === null || isNaN(val) || val === undefined) {
          flag = true;
          this.setError('Enter charge greater than $0');
        }
        const retVal = parseFloat(runningTotal) + parseFloat(val);
        return retVal;
      },
      0,
    );

    currentTotal += parseFloat(this.props.charges.data.total);
    const chargesAskedByLocation = parseFloat(onlyNumbers(locationCharges));

    // Check for inputs only if the currentTotal !== chargesAskedByLocation
    if (parseFloat(currentTotal) !== parseFloat(chargesAskedByLocation)) {
      if (currentChargeType !== '' && currentChargeValue !== '') {
        const currentChargeIndex = differenceBreakdown
          .map((breakDown: ChargeBreakDownItem) => breakDown.chargeType)
          .indexOf(currentChargeType);
        if (currentChargeIndex !== -1) {
          this.setError('Please select a different charge type!');
          return false;
        }
        const currChargeValue = parseFloat(onlyNumbers(this.state.currentChargeValue));
        currentTotal += parseFloat(currChargeValue);
      }
    }

    if (
      flag ||
      currentTotal !== chargesAskedByLocation ||
      chargesAskedByLocation === 0 ||
      currentTotal === 0
    ) {
      this.setError('Enter Correct Charges');
      return false;
    }
    return true;
  };

  handleOnChangeChargesAskedByLocation = (charge: string) => {
    // if (charge === '' || charge === '$') {
    //   this.setState({
    //     chargesAskedByLocation: '',
    //   });
    //   return;
    // }

    this.setState({
      chargesAskedByLocation: onlyNumbers(charge),
    });
  };

  handleOnAddChargeBreakdown = (newChargeType: string, newChargeValue: string) => {
    const { chargesAskedByLocation, differenceBreakdown } = this.state;

    if (
      newChargeValue === 0 ||
      newChargeValue === '' ||
      newChargeType === '' ||
      newChargeType === 'Select Issue'
    ) {
      alert('Please select at least one charge and enter its value.');
      return;
    }

    // start pre-calculation //
    const getChargeIndex = findIndex(propEq('chargeType', newChargeType));
    const chargeIndex = getChargeIndex(differenceBreakdown);

    const chargesAskedAtLocation = parseFloat(onlyNumbers(chargesAskedByLocation));

    let currentTotal: number = differenceBreakdown.reduce(
      (runningTotal: number, currentObj: ChargeBreakDownItem) => {
        const val = parseFloat(onlyNumbers(currentObj.chargeValue));
        return runningTotal + val;
      },
      0,
    );

    currentTotal =
      parseFloat(onlyNumbers(currentTotal)) +
      parseFloat(onlyNumbers(newChargeValue)) +
      parseFloat(onlyNumbers(this.props.charges.data.total));

    // end pre-calculation //

    if (chargeIndex !== -1) {
      alert('Charge already added! Select a different charge!');
    } else if (chargesAskedByLocation === '' || chargesAskedByLocation === 0) {
      alert('Please Enter Charges Asked at Location first!');
    } else if (currentTotal > chargesAskedAtLocation) {
      alert(
        `Enter Charges less than $${
          chargesAskedByLocation === '' ? '$00.00' : chargesAskedByLocation
        }!`,
      );
    } else {
      const newChargeBreakdown = {
        index: differenceBreakdown.length + 1,
        chargeType: newChargeType,
        chargeValue: onlyNumbers(newChargeValue),
      };
      this.setState({
        differenceBreakdown: [...differenceBreakdown, newChargeBreakdown],
        currentChargeType: '',
        currentChargeValue: '',
      });
    }
  };

  handleUpdateValue = (
    breakdownItem: ChargeBreakDownItem,
    newVal: string,
    updateNumber: boolean,
  ) => {
    const itemToUpdate = find((item: ChargeBreakDownItem) => item.index === breakdownItem.index)(
      this.state.differenceBreakdown,
    );
    if (itemToUpdate && keys(itemToUpdate).length > 0) {
      let updatedItem = null;
      if (updateNumber) {
        updatedItem = { ...itemToUpdate, chargeValue: onlyNumbers(newVal) };
      } else {
        updatedItem = { ...itemToUpdate, chargeType: newVal };
      }
      const updatedBreakdownItems = this.state.differenceBreakdown.filter(
        (item: ChargeBreakDownItem) => item.index !== breakdownItem.index,
      );
      this.setState({
        differenceBreakdown: [...updatedBreakdownItems, updatedItem],
      });
    }
  };

  handleOnRemoveChargeBreakdown = (index: number) => {
    const updatedBreakdownItems = this.state.differenceBreakdown.filter(
      (item: ChargeBreakDownItem) => item.index !== index,
    );
    this.setState({
      differenceBreakdown: updatedBreakdownItems,
    });
  };

  handleFormSubmit = () => {
    const {
      chargesAskedByLocation,
      differenceBreakdown,
      currentChargeType,
      currentChargeValue,
    } = this.state;

    const areValidCharges = this.validateCharges();
    if (areValidCharges) {
      if (currentChargeType !== '' && currentChargeValue !== '') {
        const newCharge = {
          index: differenceBreakdown.length + 1,
          chargeType: this.state.currentChargeType,
          chargeValue: onlyNumbers(this.state.currentChargeValue),
        };
        differenceBreakdown.push(newCharge);
      }
      const parsedCharges = parseCharges(differenceBreakdown);

      const issue = {
        chargesBreakdown: this.props.charges.data,
        chargesDueForClearance: {
          // Object.keys(parsedCharges).reduce((acc, curr) => (acc += parsedCharges[curr]), 0),
          total: chargesAskedByLocation,
          ...parsedCharges,
        },
        chargesAskedByLocation: {
          amount: chargesAskedByLocation,
        },
      };

      this.props.onSubmit(issue);
    }
  };

  toggleChargesDueBreakdown = () =>
    this.setState({ showChargesDueBreakdown: !this.state.showChargesDueBreakdown });

  render() {
    const { chargesAskedByLocation, differenceBreakdown, error } = this.state;
    // const isLoading = this.props.charges.isLoading;

    if (this.props.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size={'large'} />
          <Text>{Locale.translate('newIssue.chargesOverLimit.isLoading')}</Text>
        </View>
      );
    }

    return (
      <KeyboardAwareScrollView>
        <View style={{ flex: 1, margin: 20 }}>
          {error && error.message && <ErrorBox message={error.message} />}
          <TouchableOpacity onPress={this.toggleChargesDueBreakdown}>
            <RowView style={{ marginVertical: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', flex: 2 }}>
                Charges Due for Clearance:
              </Text>
              <Text style={{ marginRight: 10, fontSize: 16, color: 'black' }}>
                {Locale.formatCurrency(this.props.charges.data.total) || '$0.00'}
              </Text>
              <Icon
                size={18}
                color={'black'}
                name={this.state.showChargesDueBreakdown ? 'chevron-down' : 'chevron-up'}
                onPress={this.toggleChargesDueBreakdown}
              />
            </RowView>
          </TouchableOpacity>
          {this.state.showChargesDueBreakdown && (
            <ChargesDueForClearance
              onPress={() => this.setState({ showChargesDueBreakdown: false })}
              charges={this.props.charges}
            />
          )}
          <RowView
            style={{
              marginVertical: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
              Charges Asked by Location:
            </Text>
            <TextInput
              placeholder={'$00.00'}
              keyboardType="numeric"
              style={styles.textInput}
              value={chargesAskedByLocation === '' ? '' : `$${chargesAskedByLocation}`}
              onChangeText={this.handleOnChangeChargesAskedByLocation}
              underlineColorAndroid="transparent"
            />
          </RowView>
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
              Charges Type Difference:
            </Text>
            <BreakdownItem
              navigator={this.props.navigator}
              currentChargeType={this.state.currentChargeType}
              currentChargeValue={this.state.currentChargeValue}
              setCurrentChargeValue={this.setCurrentChargeValue}
              setCurrentChargeType={this.setCurrentChargeType}
              onAddChargeBreakdown={this.handleOnAddChargeBreakdown}
            />
            <ChargesBreakdown
              navigator={this.props.navigator}
              updateValue={this.handleUpdateValue}
              breakdownItems={differenceBreakdown}
              onAddChargeBreakdown={this.handleOnAddChargeBreakdown}
              onRemoveChargeBreakdown={this.handleOnRemoveChargeBreakdown}
            />
          </View>

          <Button
            onPress={this.handleFormSubmit}
            title={'Submit'}
            titleStyle={{ fontSize: 18 }}
            style={{ flex: 1, marginTop: 40, borderRadius: 40 }}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default ChargesOverLimit;
