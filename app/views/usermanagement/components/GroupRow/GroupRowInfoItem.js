// @flow

import React from 'react';
import { View, Text } from 'react-native';
import renderIf from 'render-if';

import colors from 'styles/colors';
import { BoldText18, RowView } from 'styles';

type Props = {
  label?: ?string,
  value?: ?string,
  headerTitle?: ?string,
  isHeader?: boolean,
  children: any,
  styles?: Object,
};

const GroupRowInfoItem = ({ children, styles, label, value, isHeader, headerTitle }: Props) => {
  const renderIfIsHeader = renderIf(isHeader);
  const renderDefaultCase = renderIf(!isHeader);
  return (
    <View style={{ marginVertical: 3 }}>
      {renderIfIsHeader(
        <BoldText18 style={{ color: colors.COPART_BLUE }}>{headerTitle}</BoldText18>,
      )}
      {renderDefaultCase(
        <RowView style={[styles, { alignItems: 'center' }]}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: colors.GRAY_DARK_1 }}>
            {label}:{' '}
          </Text>
          <Text style={{ fontSize: 15, color: colors.GRAY_DARK }}>{value}</Text>
          {children}
        </RowView>,
      )}
    </View>
  );
};

GroupRowInfoItem.defaultProps = {
  value: null,
  label: null,
  headerTitle: null,
  styles: {},
  isHeader: false,
};

export default GroupRowInfoItem;
