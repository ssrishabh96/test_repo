// @flow

import React from 'react';

import { RowView, InfoText } from 'styles';
import colors from 'styles/colors';

type Props = {
  label: string,
  value: string,
  styles: Object,
};

// TODO: Might want to move this to core components?
const DriverInfoItem = ({ label, value, styles }: Props) => (
  <RowView
    style={{
      paddingVertical: 10,
      paddingHorizontal: 5,
      alignItems: 'center',
    }}
  >
    <InfoText
      style={{
        marginRight: 10,
        fontWeight: 'bold',
        color: colors.GRAY_1,
        fontSize: 16,
      }}
    >
      {label}:
    </InfoText>
    <InfoText style={[{ fontSize: 16, color: colors.TEXT_DARK, textAlign: 'center' }, styles]}>
      {value}
    </InfoText>
  </RowView>
);

export default DriverInfoItem;
