// @flow

import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { pick, keys, propOr, prop } from 'ramda';

import { mapChargesBreakdown } from 'utils/mappers/chargesBreakdownMapper';

import Locale from 'utils/locale';

type Props = {
  charges: { data: { [string]: number } },
  onPress: () => void,
};

const ChargeItem = ({ label, value }: { label: string, value: number }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 12 }}>
    <Text style={{ flex: 2, textAlign: 'right', marginRight: 40 }}>{label}</Text>
    <Text style={{ marginRight: 17 }}>{value}</Text>
  </View>
);

const getStorageDates = (data: Object) => ({
  primary:
    (data.storage_from_date &&
      data.storage_to_date &&
      `${data.storage_from_date} - ${data.storage_to_date}`) ||
    '',
  secondary:
    (data.second_storage_from_date &&
      data.second_storage_to_date &&
      `${data.second_storage_from_date} - ${data.second_storage_to_date}`) ||
    '',
});

const ChargesDueForClearance = ({ charges, onPress }: Props) => {
  const data = charges.data;
  const breakdown1 = pick([
    'labor',
    'negotiated_charge',
    'estimating_fee',
    'misc_fee',
    'tow',
    'gate',
  ])(data);
  const breakdown2 = pick(['tax', 'total'])(data);

  const storageDates = getStorageDates(data);

  return (
    <TouchableWithoutFeedback onPress={() => onPress()}>
      <View style={{ alignItems: 'flex-end' }}>
        {keys(breakdown1).map((charge: string) => (
          <ChargeItem
            label={mapChargesBreakdown[charge].label}
            value={Locale.formatCurrency(data[charge])}
          />
        ))}
        <ChargeItem
          label={`${mapChargesBreakdown.storage_amount.label} (${storageDates.primary})`}
          value={Locale.formatCurrency(data.storage_amount)}
        />
        <ChargeItem
          label={`${mapChargesBreakdown.second_storage_amount.label} ${storageDates.secondary}`}
          value={Locale.formatCurrency(data.second_storage_amount)}
        />
        {keys(breakdown2).map((charge: string) => (
          <ChargeItem
            label={mapChargesBreakdown[charge].label}
            value={Locale.formatCurrency(data[charge])}
          />
        ))}
      </View>
    </TouchableWithoutFeedback>
  );
};

ChargesDueForClearance.defaultProps = {
  charges: {
    data: {
      tow: 0,
      labor: 0,
      yard_or_gate: 0,
      negotiated_storage: 0,
      estimating_fee: 0,
      misc: 0,
      misc_description: '',
      tax: 0,
      total: 0,
      storage_from: null,
      storage_to: null,
      storage_rate: 0,
      storage_amount: 0,
      second_storage_from: null,
      second_storage_to: null,
      second_storage_rate: 0,
      second_storage_amount: 0,
    },
  },
};

export default ChargesDueForClearance;
