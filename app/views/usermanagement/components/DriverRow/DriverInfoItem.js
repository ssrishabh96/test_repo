// @flow

import React from 'react';
import { View, Text } from 'react-native';
import renderIf from 'render-if';

import { BoldText18, RowView } from 'styles';
import colors from 'styles/colors';

type Props = {
  label?: ?string,
  value?: ?string,
  pcard?: any,
  headerTitle?: ?string,
  isHeader?: boolean,
  styles: Object,
};

const DriverInfoItem = ({ pcard, label, value, isHeader, headerTitle, styles }: Props) => {
  const renderIfIsHeader = renderIf(isHeader);
  const renderDefaultCase = renderIf(!isHeader);
  return (
    <View style={{ marginVertical: 3 }}>
      {renderIfIsHeader(<BoldText18 style={{ color: '#1d5ab9' }}>{headerTitle}</BoldText18>)}
      {renderDefaultCase(
        <RowView style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: colors.GRAY_DARK_1 }}>
            {label}:{' '}
          </Text>
          {!pcard && (
            <View style={styles}>
              <Text style={{ fontSize: 15, color: colors.GRAY_DARK }}>{value}</Text>
            </View>
          )}
          {pcard && pcard}
        </RowView>,
      )}
    </View>
  );
};

DriverInfoItem.defaultProps = {
  value: null,
  label: null,
  headerTitle: null,
  pcard: null,
  isHeader: false,
  styles: {},
};

export default DriverInfoItem;
