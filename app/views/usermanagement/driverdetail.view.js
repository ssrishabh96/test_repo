// @flow

import type { DriverDetailViewProps as Props } from './types';

import React, { Component } from 'react';
import { View, TouchableOpacity, Alert, Text, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { propOr, propEq, keys, find } from 'ramda';
import renderIf from 'render-if';

import { driverSelector } from './drivercontainer/drivercontainer.redux';
import {
  updatePersonnelData,
  setCurrentDriver,
  requestPcard,
  togglePcardStatus,
  destroyPcard,
} from './drivercontainer/drivercontainer.action';

import DriverInfoItem from './components/DriverRow/DriverInfoItem';
import SwitchItem from './components/SwitchItem';
// import LoadingIndicator from 'components/custom/FullScreenLoader/LoadingOverlay';
import FullScreenLoader from 'components/custom/FullScreenLoader';

import { formatPhoneNumber } from 'utils';
import Locale from 'utils/locale';
import { defaultNavStyles } from 'styles';
import colors from 'styles/colors';

const { width } = Dimensions.get('screen');

const pcardStatusMap = {
  // TODO these need to be in Locale
  A: { key: 'ACTIVE_STATUS', label: 'Active' },
  I: { key: 'INACTIVE_STATUS', label: 'Inactive' },
  P: { key: 'PENDING_STATUS', label: 'Pending' }, // showed up and on its way to the Yard
  O: { key: 'ORDERED_STATUS', label: 'Ordered' }, // accounting has oredered
  W: { key: 'WAITING_STATUS', label: 'Waiting' }, // means requested
  D: { key: 'DESTROYED_STATUS', label: 'Destroyed' },
};

export class DriverDetail extends Component<Props> {
  static navigatorStyle = defaultNavStyles;

  componentDidMount() {
    const { driverId, driverData } = this.props;
    const driverObj = find(propEq('vendorPersonnelId', driverId))(driverData);
    if (!driverObj) {
      this.props.navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: 'Driver not found. Going back...',
        },
        autoDismissTimerSec: 1.0,
      });
      this.props.navigator.pop();
    } else {
      const driverFName = propOr(Locale.translate('N/A'), 'firstName', driverObj);
      const driverLName = propOr(Locale.translate('N/A'), 'lastName', driverObj);
      if (driverObj && keys(driverObj).length > 0) {
        this.props.setCurrentDriver(driverObj);
        this.props.navigator.setTitle({
          title: `${driverFName} ${driverLName}`,
        });
      } else {
        this.props.navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            // TODO: Change error message.
            content: 'Error setting current driver. Try again.',
          },
          autoDismissTimerSec: 1.0,
        });
        this.props.navigator.pop();
      }
    }
  }

  handlePcardRequest = (yardNumber: number) => {
    const personnelId = parseInt(this.props.driverId, 10);
    const yardNum = parseInt(yardNumber, 10);
    this.props.requestPcard(personnelId, yardNum, this.props.navigator);
  };

  togglePcardStatus = (status: string) => {
    const personnelId = parseInt(this.props.driverId, 10);
    const last4 = this.props.currentDriver.pcard.cardNumber || null;
    if (!last4 || !personnelId) {
      alert('Pcard number not found');
    } else {
      const pcardStatus = status === 'I' ? 'A' : 'I';
      this.props.togglePcardStatus(personnelId, pcardStatus, last4, this.props.navigator);
    }
  };

  handlePcardAction = (action: string) => {
    if (action === 'request') {
      this.props.navigator.showModal({
        screen: 'CopartTransporter.YardsList',
        title: Locale.translate('userManagement.yardsList'),
        navigatorStyle: defaultNavStyles,
        passProps: {
          yards: this.props.yards,
          onYardSelect: this.handlePcardRequest,
        },
      });
    } else {
      // destroy
      const personnelId = parseInt(this.props.driverId, 10);
      Alert.alert('Warning', 'Are you sure you want to destroy the pcard?', [
        {
          text: 'Yes',
          onPress: () => this.props.destroyPcard(personnelId, this.props.navigator),
        },
        {
          text: 'Cancel',
          onPress: () => {},
        },
      ]);
    }
  };

  updatePersonnel = (key: string, value: boolean | string) => {
    const { currentDriver: { vendorPersonnelId }, navigator } = this.props;
    const data = {
      [key]: value,
    };
    this.props.updatePersonnelData(vendorPersonnelId, data, navigator);
  };

  render() {
    const { currentDriver, driverIsLoading } = this.props;
    const showSpinner = currentDriver === null || driverIsLoading === true;
    if (showSpinner) {
      return <FullScreenLoader isLoading={showSpinner} />;
    }

    const { currentDriver: { email, phoneNum, pcard, status, dispatchableFlag } } = this.props;
    const pcardKeys = keys(pcard);
    const renderIfNoPcard = renderIf(!pcard || pcardKeys.length === 0);
    const renderIfPcardActiveOrInactive = renderIf(
      pcard &&
        pcardKeys.length > 0 &&
        pcard.status &&
        (pcard.status === 'A' || pcard.status === 'I'),
    );
    const renderIfOtherPcardStatus = renderIf(
      pcard &&
        pcardKeys.length > 0 &&
        pcard.status &&
        (pcard.status !== 'A' && pcard.status !== 'I'),
    );

    return (
      <View style={styles.container}>
        <DriverInfoItem
          label="Status"
          value={
            status === 'A'
              ? Locale.translate('userManagement.driverDetail.Active').toUpperCase()
              : Locale.translate('userManagement.driverDetail.Inactive').toUpperCase()
          }
        />
        {/* <DriverInfoItem
          label="Group"
          value={'<Group Name>'}
        /> */}
        <DriverInfoItem
          label="Email"
          value={email}
        />
        <DriverInfoItem
          label="Phone"
          value={formatPhoneNumber(phoneNum)}
        />
        <View style={styles.rowSpaceBetween}>
          <View
            style={{
              flex: 1,
              alignSelf: 'stretch',
              justifyContent: 'flex-start',
              paddingTop: 15,
            }}
          >
            <Text style={styles.greyLabel}>
              {Locale.translate('userManagement.driverDetail.PCard')}
            </Text>
          </View>
          <View style={{}}>
            {renderIfNoPcard(
              <TouchableOpacity
                onPress={() => this.handlePcardAction('request')}
                style={styles.roundButton}
              >
                <Text style={styles.whiteBoldText16}>
                  {Locale.translate('userManagement.driverDetail.Request')}
                </Text>
              </TouchableOpacity>,
            )}
            {renderIfPcardActiveOrInactive(
              <View>
                <SwitchItem
                  onChangeStatus={() => this.togglePcardStatus(pcard.status)}
                  active={pcard && pcard.status && pcard.status === 'A'}
                  status={pcard && pcard.status && pcard.status === 'A'}
                  switchValue={
                    pcard && pcard.status && pcard.status === 'A'
                      ? Locale.translate('userManagement.driverDetail.Active')
                      : Locale.translate('userManagement.driverDetail.Inactive')
                  }
                />
                <TouchableOpacity
                  onPress={() => this.handlePcardAction('destroy')}
                  style={[styles.roundButton, { backgroundColor: colors.DARK_RED }]}
                >
                  <Text style={styles.whiteBoldText16}>
                    {Locale.translate('userManagement.driverDetail.deletePCard')}
                  </Text>
                </TouchableOpacity>
              </View>,
            )}
            {renderIfOtherPcardStatus(
              <View
                style={[
                  styles.roundButton,
                  {
                    backgroundColor: colors.DARK_YELLOW,
                  },
                ]}
              >
                <Text style={styles.whiteBoldText16}>
                  {/* Check if pcard is null at this point then, it is 'destroyed' */}
                  {pcardStatusMap[(pcard && pcard.status) || 'D'].label}
                </Text>
              </View>,
            )}
          </View>
        </View>

        <View style={styles.rowSpaceBetween}>
          <Text style={styles.greyLabel}>
            {Locale.translate('userManagement.driverDetail.status')}
          </Text>
          <SwitchItem
            onChangeStatus={() => this.updatePersonnel('status', status === 'A' ? 'I' : 'A')}
            active={status === 'A'}
            status={status}
            switchValue={
              status === 'A'
                ? Locale.translate('userManagement.driverDetail.Active')
                : Locale.translate('userManagement.driverDetail.Inactive')
            }
          />
        </View>

        <View style={[styles.rowSpaceBetween]}>
          <Text style={styles.greyLabel}>
            {Locale.translate('userManagement.driverDetail.Dispatchable')}
          </Text>
          <SwitchItem
            onChangeStatus={() => this.updatePersonnel('dispatchableFlag', !dispatchableFlag)}
            active={dispatchableFlag}
            dispatchableFlag={dispatchableFlag}
            switchValue={dispatchableFlag ? Locale.translate('Yes') : Locale.translate('No')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  greyLabel: { color: '#545a63', fontSize: 16, fontWeight: 'bold' },
  roundButton: {
    backgroundColor: colors.COPART_BLUE,
    padding: 10,
    height: 45,
    width: width / 2,
    alignSelf: 'flex-end',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSize16: { fontSize: 16 },
  whiteBoldText16: { fontSize: 16, color: colors.WHITE, fontWeight: 'bold' },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
});

const mapDispatchToProps = {
  setCurrentDriver,
  requestPcard,
  togglePcardStatus,
  destroyPcard,
  updatePersonnelData,
};

export default connect(driverSelector, mapDispatchToProps)(DriverDetail);
