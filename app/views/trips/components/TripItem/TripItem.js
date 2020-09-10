import React from 'react';
import { View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import { prop } from 'ramda';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import renderIf from 'render-if';

import { CountBadge } from 'components/custom/Lot/Badges';
import icons from 'constants/icons';
import colors, { badgeColors } from 'styles/colors';
import { getNextLocationFromLot } from 'utils/lotUtils';
import Locale from 'utils/locale';
import styles from './styles';

const towTypesMap = {
  S: 'Standard',
  M: 'Medium',
  H: 'Heavy',
};

const Flag = () => (
  <Icon
    name={'bookmark'}
    size={35}
    color={colors.DARK_RED}
    style={{
      position: 'absolute',
      top: -13,
      right: -60,
      left: 250,
      zIndex: 999,
      backgroundColor: 'transparent',
      shadowColor: colors.LIGHT_RED,
      opacity: 0.96,
    }}
  />
);

const Checkbox = ({ selected }) => (
  <View style={{ justifyContent: 'center', marginRight: 5 }}>
    <Icon
      size={22}
      name={selected ? 'check-square-o' : 'square-o'}
      color={selected ? colors.LIGHT_GREEN : 'black'}
      style={{ paddingRight: 5 }}
    />
  </View>
);

const TripItem = ({
  isInSelectMode,
  selected,
  listType,
  activeIssue,
  disabled,
  trip,
  renderExtraView,
}) => {
  const { lots, tripId, tripName } = trip;
  const lotInfo = lots.reduce(
    (acc, lotObj) => {
      if (lotObj.formType === 'P') {
        acc.pickupCount += 1; // eslint-disable-line
      } else {
        acc.dropCount += 1; // eslint-disable-line
      }
      acc.count += 1;
      const location = getNextLocationFromLot(lotObj);
      acc.sourceLocations.add(location.city);
      acc.towTypes.add(towTypesMap[lotObj.towType]);
      return acc;
    },
    { pickupCount: 0, dropCount: 0, sourceLocations: new Set(), towTypes: new Set(), count: 0 },
  );

  const issueResolution = prop('override_reason')(trip);
  const renderIfHasIssue = renderIf(activeIssue);
  const renderIfIssueResolved = renderIf(issueResolution !== null);

  const showCheckBox = !disabled && isInSelectMode;

  return (
    <View style={styles.container}>
      {showCheckBox && <Checkbox selected={selected} />}
      <View style={styles.content}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {activeIssue && <Flag />}
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#323742', marginRight: 6 }}>
            {Locale.translate('tab.Assigned.Trip')}:
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.COPART_BLUE }}>
            {tripId} | {tripName}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
          <Text style={{ fontSize: 14, marginRight: 4, fontWeight: 'bold', color: 'red' }}>
            {Locale.translate('tab.Assigned.Due')}: {moment(trip.trip_date).format('MM/DD/YYYY')}
          </Text>
          <Text style={{ fontSize: 14, marginRight: 4, fontWeight: 'bold' }}>
            {Locale.translate('tab.Assigned.PickUp')}: {lotInfo.pickupCount}
          </Text>
          <Text style={{ fontSize: 14, marginRight: 4, fontWeight: 'bold' }}>
            {Locale.translate('tab.Assigned.Delivery')}: {lotInfo.dropCount}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
          <Image source={icons.tripsScreen.tripIconLocationPin} />
          <Text style={{ fontSize: 14, color: '#005abc', paddingLeft: 3 }}>
            {Array.from(lotInfo.sourceLocations).join(', ')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
          <Text style={{ fontSize: 14, paddingLeft: 3, fontWeight: 'bold' }}>
            {Locale.translate('tab.Assigned.TowType')}: {Array.from(lotInfo.towTypes).join(', ')}
          </Text>
        </View>
        {renderIfHasIssue(
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 3, margin: 3 }}>
            <Text
              style={{ fontSize: 14, paddingLeft: 3, fontWeight: 'bold', color: colors.DARK_RED }}
            >
              {Locale.translate('trip.TripItem.RejectionReason')}: {trip.rejection_reason}
            </Text>
          </View>,
        )}
        {renderIfIssueResolved(
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              paddingVertical: 3,
              margin: 3,
            }}
          >
            <Icon
              name={'exclamation-triangle'}
              size={16}
              color={colors.DARK_RED}
            />
            <Text
              style={{
                fontSize: 14,
                paddingLeft: 3,
                fontWeight: 'bold',
                color: colors.DARK_RED,
              }}
            >
              {Locale.translate('trip.TripItem.OverrideReason')}: {trip.override_reason}
            </Text>
          </View>,
        )}
        {renderExtraView ? renderExtraView(trip) : null}
      </View>
      <CountBadge
        count={lotInfo.count}
        containerStyle={{ backgroundColor: badgeColors[listType], alignSelf: 'center' }}
      />
    </View>
  );
};

TripItem.propTypes = {
  listType: PropTypes.string.isRequired,
  isInSelectMode: PropTypes.bool,
  selected: PropTypes.bool,
  activeIssue: PropTypes.bool,
  disabled: PropTypes.bool,
  trip: PropTypes.shape.isRequired,
  renderExtraView: PropTypes.func,
};

TripItem.defaultProps = {
  isInSelectMode: false,
  selected: false,
  activeIssue: false,
  disabled: false,
  renderExtraView: null,
};

export default TripItem;
