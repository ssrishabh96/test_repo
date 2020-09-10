import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import PropTypes from 'prop-types';

import icons from 'constants/icons';
import colors from 'styles/colors';
import Locale from 'utils/locale';

const BigButton = ({ icon, label, onPress, hasIssue }) => {
  const disabled = hasIssue;
  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
        <Image
          source={icon}
          style={disabled ? { tintColor: 'grey' } : null}
        />
        <Text
          style={{
            color: disabled ? 'grey' : '#fefefe',
            fontSize: 12,
            paddingTop: 3,
          }}
        >
          {Locale.translate(label)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

BigButton.propTypes = {
  hasIssue: PropTypes.bool.isRequired,
  selected: PropTypes.object.isRequired, // eslint-disable-line
  icon: PropTypes.any.isRequired, // eslint-disable-line
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const AcknowledgeButtonGroup = ({ onReject, onAccept, /* selected, */ hasIssue }) => (
  <View
    style={{
      backgroundColor: hasIssue ? colors.DISABLED : '#323742',
      height: 75,
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    }}
  >
    <BigButton
      hasIssue={hasIssue}
      icon={icons.tripsScreen.tripIconRejectLots}
      label="Decline"
      onPress={onReject}
    />
    <View style={{ width: 1, marginVertical: 5, backgroundColor: colors.GRAY_LIGHT }} />
    <BigButton
      hasIssue={hasIssue}
      icon={icons.tripsScreen.tripIconAcceptLots}
      label="Acknowledge"
      onPress={onAccept}
    />
  </View>
);

AcknowledgeButtonGroup.propTypes = {
  hasIssue: PropTypes.bool.isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

export default AcknowledgeButtonGroup;
