/* eslint-disable no-useless-computed-key */

import { keys } from 'ramda';

const chargesBreakdownMapper = {
  labor: {
    label: 'Labor',
  },
  negotiated_storage: {
    label: 'Flat/Negotiated Storage',
  },
  estimating_fee: {
    label: 'Teardown/Estimating Fee',
  },
  misc_fee: {
    label: 'Miscellaneous',
  },
  tow: {
    label: 'Tow',
  },
  gate: {
    label: 'Yard/Gate',
  },
  storage_amount: {
    label: 'Storage',
  },
  second_storage_amount: {
    label: 'Secondary Storage',
  },
  tax: {
    label: 'Tax',
  },
  total: {
    label: 'Total',
  },
};

export const mapChargesBreakdown = chargesBreakdownMapper; // renameKeys(chargesBreakdownMapper);

export const reverseChargeMapper = keys(chargesBreakdownMapper).reduce(
  (acc, current) => ({
    ...acc,
    [chargesBreakdownMapper[current].label]: current,
  }),
  {},
);
