import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import renderIf from 'render-if';

import InlineLoader from 'components/custom/FullScreenLoader/InlineLoader';
import PaymentAccepted from 'components/custom/Lot/PaymentAccepted';
import CashReadyStatus from 'components/custom/Lot/CashReadyStatus';

import Locale from 'utils/locale';
import { getLotTripTypeInfo } from 'constants/tripTypeMap';
import colors from 'styles/colors';

const AdvancesAndPickupInformation = ({ lot, charges }) => (
  <View style={styles.container}>
    <Text style={styles.heading}>{getLotTripTypeInfo(lot).advancesAndInformationHeading}</Text>
    <View style={styles.content}>
      <View style={{ marginRight: 20 }}>
        {charges.isLoading ? (
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.field}>{Locale.translate('lotView.charges.due')} </Text>
            <InlineLoader />
          </View>
        ) : (
          <Text style={styles.field}>
            {Locale.translate('lotView.charges.due')}{' '}
            {charges.data && Locale.formatCurrency(charges.data.total)}
          </Text>
        )}
      </View>
      {renderIf(lot.paymentMode)(
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.field}>{Locale.translate('lotView.charges.accepts')}</Text>
          <PaymentAccepted
            mode={lot.paymentMode}
            row
          />
        </View>,
      )}
    </View>
    {renderIf(lot.tripType === 'P' && lot.paymentMode === 'CASH')(
      <CashReadyStatus cashStatus={lot.cashStatus} />,
    )}
  </View>
);

AdvancesAndPickupInformation.defaultProps = {
  lot: {},
  charges: {},
};

const styles = StyleSheet.create({
  container: { paddingVertical: 10 },
  heading: { color: colors.COPART_BLUE, fontWeight: 'bold', fontSize: 14 },
  content: { paddingVertical: 5, flexDirection: 'row', justifyContent: 'space-between' },
  field: { color: 'rgb(84, 90, 99)', fontSize: 13, fontWeight: '600' },
});

export default AdvancesAndPickupInformation;
