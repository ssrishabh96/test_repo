// @flow

import type { Lot } from 'types/Lot';
import type { RNNNavigator } from 'types/RNNavigation';

import React, { Component } from 'react';
import { View, Text, Linking, Platform } from 'react-native';

import IconButton from 'components/core/Button/IconButton';
import { StatusBadge } from 'components/custom/Lot/Badges';

import icons from 'constants/icons';
import { LOT_STATUSES } from 'constants/Lot';
import { getNextLocationFromLot } from 'utils/lotUtils';

import styles from './styles';

const ButtonGroup = (props: Object) => (
  <View
    style={[
      {
        width: props.children.length * 38 + 5,
      },
      styles.buttonGroup,
      props.style,
    ]}
  >
    {props.children}
  </View>
);

type Props = {
  lotNumber: number,
  lotStatus: string,
  lot: Lot,
  lotStatus: number,
  navigator: RNNNavigator,
  onNavigateToIssueDetail: () => void,
  onLotInfoPressed: () => void,
  onPressEmail: () => void,
};

export default class ViewHeader extends Component<Props> {
  openMap = ({ latitude, longitude, zoomLevel = 15 }: Object) => {
    const link = Platform.select({
      ios: `http://maps.apple.com/?daddr=${latitude},${longitude}&z=${zoomLevel}`,
      android: `http://maps.google.com/maps?daddr=${latitude},${longitude}&z=${zoomLevel}`,
    });
    Linking.openURL(link).catch((err: Object) => console.error('An error occured', err));
  };

  handleNavigatioToIssueLotDetail = () => this.props.onNavigateToIssueDetail();

  render() {
    const { lotNumber, lotStatus, lot, onLotInfoPressed, onPressEmail } = this.props;
    const hasIssue = lot.active_issue_flag === 'Yes';
    return (
      <View style={styles.navbarHeading}>
        <View style={styles.headerLeft}>
          <Text style={styles.lotNumber}>LOT #{lotNumber}</Text>
          <StatusBadge
            style={{ marginLeft: 0 }}
            status={lotStatus}
            hasIssue={hasIssue}
            onPress={hasIssue ? this.handleNavigatioToIssueLotDetail : null}
          />
        </View>
        <ButtonGroup>
          {lotStatus !== LOT_STATUSES.AWAITING_CHECKIN && (
            <IconButton
              icon={icons.tripsScreen.tripIconEmail}
              onPress={onPressEmail}
            />
          )}
          <IconButton
            icon={icons.infoIcon}
            onPress={onLotInfoPressed}
          />
          <IconButton
            icon={icons.tripsScreen.tripIconMap}
            onPress={() => {
              this.openMap({
                latitude: getNextLocationFromLot(this.props.lot).latitude,
                longitude: getNextLocationFromLot(this.props.lot).longitude,
              });
            }}
          />
        </ButtonGroup>
      </View>
    );
  }
}
