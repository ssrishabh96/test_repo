/**
 * @flow
 */

import type { Lot } from 'types/Lot';
import { IssuesLotDetailViewProps as Props, State } from './types';

import React, { Component } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import renderIf from 'render-if';
import ActionButton from 'react-native-action-button';
import Locale from 'utils/locale';

import { issuesLotListSelector } from './issuesqueue.redux';
import {
  resolveIssueOnLot,
  markResolvedIssueAsRead,
  escalateIssue,
  fetchIssueLotDetail,
} from './issuesqueue.action';
import { getUserRole } from 'views/login/login.redux';
import { setCurrentLotList } from 'views/lotlist/lotlist.action';

import IssueActions from './components/IssueActions';
import IssueBanner from './components/IssueBanner';
import LotHeaderInfo from 'components/custom/LotHeaderInfo';

import { GROUP_MANAGER } from 'constants/user/roles';
import icons from 'constants/icons';
import { defaultNavStyles } from 'styles';

class IssuesLotDetail extends Component<Props, State> {
  static navigatorStyle = defaultNavStyles;

  constructor(props: Props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  state = {
    distributeOpen: false,
    distributeClose: false,
    lot: null,
  };

  componentWillMount() {
    if (!this.props.lot) {
      // fetch data, coming from lotview (issue button in header)
      this.props
        .fetchIssueLotDetail(this.props.dispatchAssignmentDetailId)
        .then((response: Object) => {
          if (
            Object.keys(response.data).length > 0 &&
            parseInt(response.data.dispatchAssignmentDetailId, 10) ===
              parseInt(this.props.dispatchAssignmentDetailId, 10)
          ) {
            this.setState({ lot: response.data });
          }
        });
    } else {
      this.setState({ lot: this.props.lot });
    }
  }

  onNavigatorEvent = (event: Object) => {
    const { navigator } = this.props;
    if (event.type === 'DeepLink') {
      const links = event.link.split('/');
      if (links && links[0] === 'popTo' && links[1] === 'issuesQueue') {
        navigator.pop();
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: event.payload.type,
            content: event.payload.content,
          },
          autoDismissTimerSec: 2.0,
        });
      }
    }
  };

  getLotInstance = (): ?Lot => {
    const { lot, lotDetail } = this.props;

    let data = null;
    if (lot === null && lotDetail !== null) {
      data = lotDetail;
    } else if (lot !== null && lotDetail === null) {
      data = lot;
    } else {
      data = lot || lotDetail; // looks wrong, but most of the times both have same value
    }
    return data;
  };

  getActionButtons = (role: number, onItemClick: Function) => {
    const items = [
      renderIf(role < GROUP_MANAGER)(
        <ActionButton.Item
          title="Group"
          buttonColor="#1d5ab9"
          onPress={() => onItemClick('group')}
        >
          <Image source={icons.tripsScreen.tripIconGroup} />
        </ActionButton.Item>,
      ),
      <ActionButton.Item
        title="Driver"
        buttonColor="#1d5ab9"
        onPress={() => onItemClick('driver')}
      >
        <Image source={icons.tripsScreen.tripIconDriver} />
      </ActionButton.Item>,
    ];
    return items.filter((item: Object) => item);
  };

  handleResolveIssue = (action: string, comments: string = '') => {
    const { comingFrom, comingFromTripList, navigator } = this.props;
    const lot: ?Lot = this.state.lot;
    if (action === 'change_driver') {
      this.props.navigator.showModal({
        screen: 'CopartTransporter.AssignToList',
        title: 'Assign To',
        passProps: {
          type: 'driver',
          mode: 'issue',
          comingFrom,
          lot,
        },
      });
    } else if (action === 'cant_clear') {
      this.props.escalateIssue(lot && lot.dispatchAssignmentDetailId, this.props.navigator);
    } else {
      const { trip, comingFromIssuesQueue } = this.props;
      const tripId = trip && trip.tripId;
      // call setCurrentLotList action here
      const updateLotList = () => {
        // somehow set isLoading to true inside lotlist.view.js
        navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: `Action taken on LOT # ${lot.lotNumber}!`,
          },
        });
      };

      // pass updateLotList cb with the action
      this.props.resolveIssueOnLot(
        action,
        lot && lot.dispatchAssignmentDetailId,
        comments && comments !== '' ? { comments } : {},
        comingFrom,
        navigator,
        false, // dismissModal ?
        comingFromTripList && tripId ? updateLotList : null, // updateLotList cb not used currently
        tripId,
        comingFromIssuesQueue,
      );

      navigator.pop();
    }
  };

  handleChangePersonnel = (type: 'group' | 'driver') => {
    const closeFabCallback = () => {
      this.setState({
        distributeOpen: false,
        distributeClose: false,
      });
    };
    this.props.navigator.showModal({
      screen: 'CopartTransporter.AssignToList',
      title: 'Assign To',
      passProps: {
        type,
        mode: 'trip_maintenance',
        // comingFrom,
        lot: this.state.lot,
        closeFabCallback,
      },
    });
  };

  handleOnReadResolvedIssue = () => {
    const { lot, comingFrom, navigator } = this.props;
    this.props.readResolvedIssue(
      lot.dispatchAssignmentDetailId,
      lot.messageHeaderId,
      comingFrom,
      navigator,
    );
  };

  handleDistributeButton = () => {
    const { distributeOpen, distributeClose } = this.state;
    if (!distributeOpen && !distributeClose) {
      this.setState({
        distributeOpen: true,
      });
    } else if (distributeOpen && distributeClose) {
      this.setState({
        distributeOpen: false,
        distributeClose: false,
      });
    } else if (distributeOpen) {
      this.setState({
        distributeClose: true,
      });
    }
  };

  renderLoadingIndicator = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={'large'} />
    </View>
  );

  render() {
    const { comingFrom, isLoading, navigator } = this.props;
    const { distributeOpen, distributeClose } = this.state;

    const lot = this.state.lot;

    if (!lot) {
      // isLoading.raised || isLoading.assigned
      return this.renderLoadingIndicator();
    }

    const renderIfPartialLot = renderIf(lot && lot.is_partial_trip_lot);
    const renderIfShowDistribute = renderIf(distributeOpen || distributeClose);
    return (
      <View style={{ flex: 1 }}>
        {lot ? (
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 44,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#323742',
              }}
            >
              <View style={{ paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#fefefe', fontWeight: 'bold' }}>
                  {Locale.translate('LOT')} #{lot.lotNumber}
                </Text>
              </View>
            </View>
            <LotHeaderInfo
              lot={lot}
              vehicleType={lot.vehicleType}
            />
            <IssueBanner issue={lot.messageTypeDescription} />
            {renderIfPartialLot(
              <View style={{ margin: 10 }}>
                <Text>
                  {`${Locale.translate('issuesQueue.lotDetail.comments')}:
                    ${lot.partial_trip_comments || Locale.translate('N/A')}`}
                </Text>
              </View>,
            )}
            <IssueActions
              lot={lot}
              comingFrom={comingFrom}
              navigator={navigator}
              onReadResolvedIssue={this.handleOnReadResolvedIssue}
              onResolveIssue={this.handleResolveIssue}
              onDistributeIssueLot={this.handleDistributeButton}
            />
            {renderIfShowDistribute(
              <ActionButton
                icon={
                  <Image
                    source={
                      this.state.distributeClose
                        ? icons.tripsScreen.tripIconClose
                        : icons.tripsScreen.tripIconDistribute
                    }
                  />
                }
                onPress={this.handleDistributeButton}
                degrees={0}
              >
                {this.getActionButtons(this.props.role, this.handleChangePersonnel)}
              </ActionButton>,
            )}
          </View>
        ) : null}
      </View>
    );
  }
}

const mapDispatchToProps = {
  fetchIssueLotDetail,
  resolveIssueOnLot,
  escalateIssue,
  readResolvedIssue: markResolvedIssueAsRead,
  setCurrentLotList,
};

const mapStateToProps = (state: Object) => ({
  ...issuesLotListSelector(state),
  role: getUserRole(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IssuesLotDetail);
