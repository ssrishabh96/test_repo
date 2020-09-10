import React from 'react';
import { View, Image, Text } from 'react-native';
import PropTypes from 'prop-types';
import Locale from 'utils/locale';

import icons from 'constants/icons';
import colors from 'styles/colors';

import { CASH_STATUSES } from 'constants/Lot';

const cashStatusDescription = {
  1: 'Awaiting Check Generation',
  2: 'Awaiting Cash Ready',
  3: 'Cash is Ready for Pick up!',
  4: 'Cash pending from driver',
  5: 'Completed',
};

const cashReadyFlagMap = {
  1: icons.awaitingCheck,
  2: icons.awaitingCash,
  3: icons.cashReadyFlag,
  4: icons.cashWithDriver,
  5: icons.cashCompleted,
};

const CashReadyStatus = ({ mini, cashStatus }) => (
  <View style={{ flexDirection: 'row', margin: 3, alignItems: 'center' }}>
    <Image
      source={cashReadyFlagMap[cashStatus]}
      style={[
        { height: 23, width: 27 },
        cashStatus == CASH_STATUSES.COMPLETED
          ? { tintColor: colors.DARK_GREEN }
          : { tintColor: colors.COPART_BLUE },
      ]}
    />
    {!mini ? (
      <Text style={{ marginLeft: 5, fontSize: 14, fontWeight: 'bold', color: colors.GRAY_DARK }}>
        {cashStatusDescription[cashStatus] || Locale.translate('N/A')}
      </Text>
    ) : null}
  </View>
);

CashReadyStatus.propTypes = {};

export default CashReadyStatus;
