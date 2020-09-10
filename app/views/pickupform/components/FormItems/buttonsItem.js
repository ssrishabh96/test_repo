import React from 'react';
import { View, Text } from 'react-native';
import renderIf from 'render-if';
import Lot from 'types/Lot';
import colors from '../../../../styles/colors';
import { formStyles, RoundButton } from './styles';
import { Required, Warning } from './flags';

function buttonStyle(optionKey: string, value: string) {
  let styles;
  if (optionKey === value) {
    styles = {
      flex: 0.5,
      marginRight: 5,
      borderColor: '#005abb',
      backgroundColor: '#005abb',
    };
  } else {
    styles = {
      flex: 0.5,
      marginRight: 5,
      borderWidth: 1.5,
      borderColor: '#005abb',
      backgroundColor: 'white',
    };
  }
  return styles;
}

function textStyle(optionKey: string, value: string) {
  let styles;
  if (optionKey === value) {
    styles = {
      color: 'white',
      textAlign: 'center',
      // fontWeight: 'bold',
      fontSize: 15,
      padding: 5,
    };
  } else {
    styles = {
      color: '#005abb',
      textAlign: 'center',
      // fontWeight: 'bold',
      fontSize: 15,
      padding: 5,
    };
  }
  return styles;
}

const onPress = (key: string, value: string, currentValue: string, handleOnSelect: () => any) => {
  if (value === currentValue) return handleOnSelect(key, '');
  return handleOnSelect(key, value);
};

function addButton(
  optionK: string,
  optionV: string = optionK,
  value: string,
  key1: string,
  handleOnSelect: () => any,
) {
  const optionKeys = optionK.split('|');
  const optionValues = optionV.split('|');
  const buttons = [];
  for (let i = 0; i < optionKeys.length; i += 1) {
    buttons.push(
      <RoundButton
        key={key1 + i}
        onPress={() => onPress(key1, optionValues[i], value, handleOnSelect)}
        style={buttonStyle(optionValues[i], value)}
        underlayColor="white"
      >
        <Text style={textStyle(optionValues[i], value)}>{optionKeys[i]}</Text>
      </RoundButton>,
    );
  }
  return buttons;
}

const ButtonsItem = ({
  /* id, */
  label,
  required,
  showWarning,
  optionKeys,
  optionValues,
  key1,
  currentPickupLot,
  handleOnSelect,
  showWarningNotification,
}: Props) => {
  const renderIfIsRequired = renderIf(required);
  return (
    <View
      style={{
        flex: 1,
        minHeight: 45,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: '#EBEBEB',
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingTop: 3,
        }}
      >
        {showWarning && <Warning onPress={() => showWarningNotification({ label })} />}
        <Text style={formStyles.label}>{label}</Text>
        {renderIfIsRequired(<Required />)}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
        {addButton(optionKeys, optionValues, currentPickupLot[key1], key1, handleOnSelect)}
      </View>
    </View>
  );
};

type Props = {
  +label: string,
  +required: boolean,
  +showWarning: boolean,
  +optionKeys: string,
  +optionValues: string,
  +key1: string,
  +currentPickupLot: Lot,
  +handleOnSelect: () => any,
  +showWarningNotification: () => any,
};

ButtonsItem.defaultProps = {
  label: 'N/A',
};

export default ButtonsItem;
