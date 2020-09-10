import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { keys } from 'ramda';
import renderIf from 'render-if';

import colors from 'styles/colors';

type Props = {
  pcard: Object,
};

const PcardItem = ({ pcard }: Props) => {
  const renderIfPcard = renderIf(pcard && keys(pcard).length > 0 && pcard.status === 'A');
  const renderIfNoPcard = renderIf(
    !pcard || keys(pcard).length === 0 || (pcard.status && pcard.status !== 'A'),
  );
  return (
    <View>
      {renderIfPcard(
        <View style={styles.btnStyle}>
          <Text style={styles.textStyle}>{pcard && pcard.status}</Text>
        </View>,
      )}
      {renderIfNoPcard(
        <View style={[styles.btnStyle, { backgroundColor: 'orange' }]}>
          <Text style={styles.textStyle}>
            {(pcard && keys(pcard).length > 0 && pcard.status) || 'N/A'}
          </Text>
        </View>,
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: colors.DARK_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: { fontSize: 14, color: '#fff', fontWeight: 'bold' },
});

export default PcardItem;
