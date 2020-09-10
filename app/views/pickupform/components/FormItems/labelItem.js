import React from 'react';
import { View, Text } from 'react-native';
import { compose, split } from 'ramda';
import Lot from 'types/Lot';
import colors from '../../../../styles/colors';
import { formStyles } from './styles';
import Locale from 'utils/locale';

type Props = {
  +label: string,
  +key1: string,
  +format: string,
  +currentPickupLot: Lot,
};
const LabelItem = ({
  /* id, */
  label,
  key1,
  format,
  currentPickupLot,
}: Props) => (
  <View
    style={{
      flex: 1,
      minHeight: 35,
      paddingLeft: 10,
      paddingTop: 5,
      paddingRight: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      // borderColor: '#EBEBEB',
      // borderBottomWidth: 1,
    }}
  >
    <Text style={[formStyles.label, { paddingTop: 3 }]}>{label}</Text>
    <Text
      style={[
        formStyles.value,
        {
          paddingTop: 3,
        },
      ]}
    >
      {formatText(format, currentPickupLot[key1])}
    </Text>
  </View>
);

function formatText(type, value) {
  if (value === '' || value === undefined || value === null) return Locale.translate('N/A');
  switch (type) {
    case 'currency':
      return Locale.formatCurrency(value);
    case 'date':
      return compose(([year, month, day]) => `${month}/${day}/${year}`, split('-'))(value);
    default:
      return value;
  }
}
LabelItem.defaultProps = {
  label: 'N/A',
};

export default LabelItem;
