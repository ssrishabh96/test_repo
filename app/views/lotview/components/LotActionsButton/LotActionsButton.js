import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import renderIf from 'render-if';

import { getLotTripTypeInfo } from 'constants/tripTypeMap';
import { LOT_STATUSES } from 'constants/Lot';

import colors, { badgeColors } from 'styles/colors';

import { RoundButton, BannerView } from './styles';

import Switch from 'components/core/Switch';

import Locale from 'utils/locale';

const startButtonColor = {
  accepted: '#005abc',
  inprogress: badgeColors.inProgress,
  disabled: '#ddd',
};
const { width } = Dimensions.get('screen');

const PendingAcknowledgement = () => (
  <View style={[styles.singleButtonWrapper, { backgroundColor: colors.GRAY_DARK_1 }]}>
    <BannerView
      disabled
      onPress={() => {}}
      style={{ flex: 1, backgroundColor: colors.GRAY_DARK_1, marginBottom: 10 }}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
        {Locale.translate('actionButton.lotView.PendingAcknowledgement')}
      </Text>
    </BannerView>
  </View>
);

export const PendingSync = () => (
  <View
    style={{
      height: 25,
      backgroundColor: 'green',
      justifyContent: 'center',
      paddingHorizontal: 10,
    }}
  >
    <Text style={{ color: 'white', fontWeight: 'bold' }}>Ready For Submit</Text>
  </View>
);

const InTransitLotMessage = ({ onPressSubmitCheckin, onPressUnableToPickup, hasIssue }) => (
  <View
    style={[
      styles.multiButtonWrapper,
      { paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' },
    ]}
  >
    <RoundButton
      onPress={onPressUnableToPickup}
      disabled={hasIssue}
      style={{ flex: 1, margin: 2, backgroundColor: hasIssue ? colors.DISABLED : colors.DARK_RED }}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
        {Locale.translate('actionButton.lotView.UnableToDeliver')}
      </Text>
    </RoundButton>
    <RoundButton
      onPress={onPressSubmitCheckin}
      disabled={hasIssue}
      style={{
        flex: 1,
        margin: 2,
        backgroundColor: hasIssue ? colors.DISABLED : colors.COPART_BLUE,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
        {Locale.translate('actionButton.lotView.LotDropOff')}
      </Text>
    </RoundButton>
  </View>
);

const CompletedLotMessage = ({ completionDate }) => (
  <View style={[styles.singleButtonWrapper, { backgroundColor: colors.GRAY_DARK_1 }]}>
    <BannerView
      disabled
      onPress={() => {}}
      style={{ flex: 1, backgroundColor: colors.GRAY_DARK_1, marginBottom: 10 }}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
        {Locale.translate('actionButton.lotView.LotCompleted')} {completionDate}!
      </Text>
    </BannerView>
  </View>
);

// status -> assigned/accepted/inprogress
const pickupEnabledStatus = [
  LOT_STATUSES.AWAITING_FORM_SUBMISSION,
  LOT_STATUSES.AWAITING_CHECKIN,
  LOT_STATUSES.AWAITING_TRIP_VERIFICATION,
];

export const OtherActions = ({
  lot,
  onPressStart,
  onPressPickupOrder,
  lotStatus,
  onPressUnableToPickup,
  hasIssue,
  isAwaitingSync,
}) => (
  <View style={styles.multiButtonWrapper}>
    {renderIf(isAwaitingSync)(<PendingSync />)}
    {renderIf(lot.formType === 'U')(
      <View
        style={{
          height: 25,
          backgroundColor: 'red',
          justifyContent: 'center',
          paddingHorizontal: 10,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Unknown form type</Text>
      </View>,
    )}
    <Switch
      onChangeState={(state) => {
        if (state) onPressStart();
      }}
      style={styles.switchContainer}
      buttonStyle={styles.switchButton}
      disabledButtonStyle={
        lotStatus === LOT_STATUSES.AWAITING_IN_PROGRESS
          ? { backgroundColor: '#ddd' }
          : { opacity: 0.5 }
      }
      inactiveButtonColor={startButtonColor.accepted}
      activeButtonColor={startButtonColor.inprogress}
      activeButtonPressedColor={startButtonColor.inprogress}
      activeBackgroundColor="#ddd"
      inactiveBackgroundColor="#ddd"
      disabled={lotStatus !== LOT_STATUSES.AWAITING_IN_PROGRESS || hasIssue}
      active={lotStatus !== LOT_STATUSES.AWAITING_IN_PROGRESS}
      buttonRadius={23}
      switchWidth={width - 23}
      switchHeight={47}
      buttonContent={active => (
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {!active ? 'Start' : 'In Progress'}
        </Text>
      )}
    />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <RoundButton
        onPress={onPressUnableToPickup}
        disabled={hasIssue}
        style={{
          flex: 0.5,
          marginRight: 5,
          backgroundColor: hasIssue ? colors.DISABLED : colors.DARK_RED,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {getLotTripTypeInfo(lot).issueButton}
        </Text>
      </RoundButton>
      <RoundButton
        onPress={onPressPickupOrder}
        disabled={!pickupEnabledStatus.includes(lotStatus) || hasIssue || lot.formType === 'U'}
        style={{
          flex: 0.5,
          backgroundColor:
            !pickupEnabledStatus.includes(lotStatus) || hasIssue || lot.formType === 'U'
              ? colors.DISABLED
              : colors.COPART_BLUE,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {getLotTripTypeInfo(lot).orderButton}
        </Text>
      </RoundButton>
    </View>
  </View>
);

OtherActions.propTypes = {
  lotStatus: PropTypes.string.isRequired,
  hasIssue: PropTypes.bool.isRequired,
  onPressStart: PropTypes.func.isRequired,
  onPressUnableToPickup: PropTypes.func.isRequired,
  onPressPickupOrder: PropTypes.func.isRequired,
  tripType: PropTypes.string.isRequired,
};

InTransitLotMessage.propTypes = {
  onPressSubmitCheckin: PropTypes.func.isRequired,
  onPressUnableToPickup: PropTypes.func.isRequired,
  hasIssue: PropTypes.bool.isRequired,
};

const LotActions = (props) => {
  switch (props.lotStatus) {
    case LOT_STATUSES.AWAITING_VENDOR_ACKNOWLEDGEMENT:
    case LOT_STATUSES.AWAITING_GROUP_ACKNOWLEDGEMENT:
    case LOT_STATUSES.AWAITING_DRIVER_ACKNOWLEDGEMENT:
      return <PendingAcknowledgement />;
    case LOT_STATUSES.AWAITING_ARRIVAL:
      return <InTransitLotMessage {...props} />;
    case LOT_STATUSES.AWAITING_TRIP_VERIFICATION:
    case LOT_STATUSES.AWAITING_CHECKIN:
    case LOT_STATUSES.COMPLETED:
      return <CompletedLotMessage {...props} />;
    default:
      return <OtherActions {...props} />;
  }
};
const styles = {
  singleButtonWrapper: { height: 65, paddingHorizontal: 10, paddingTop: 10 },
  multiButtonWrapper: { paddingHorizontal: 10, paddingBottom: 10 },
  switchContainer: {
    marginVertical: 10,
  },
  switchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 22.5,
    padding: 5,
    width: (width - 26) / 2,
  },
};
export default LotActions;
