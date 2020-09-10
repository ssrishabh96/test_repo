import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import renderIf from 'render-if';

import {
  startForLot,
  loadAllLotInfo,
  cacheLotData,
  getLotCharges,
  clearLotInfo,
} from './lotview.action';
import { lotviewSelector } from './lotview.redux';
import { checkInLots } from '../../views/lotlist/lotlist.action';

import ToolTip from 'components/custom/ToolTip';
import FullScreenLoader from 'components/custom/FullScreenLoader';
import ViewHeader from './components/ViewHeader';
import LotHeaderInfo from 'components/custom/LotHeaderInfo';
import LocationInformation from './components/LocationInformation';
import AdvancesAndPickupInformation from './components/AdvancesAndPickupInformation';
import TripNotes from './components/TripNotes';
import LotActionsButton from './components/LotActionsButton';
import { OfflineBanner } from 'components/custom/Banner';

import { getLotTripTypeInfo } from 'constants/tripTypeMap';

import { defaultNavStyles } from 'styles';

export class LotView extends Component {
  static navigatorStyle = defaultNavStyles;

  static propTypes = {
    lotNumber: PropTypes.number.isRequired,
    startForLot: PropTypes.func.isRequired,
    signoutUser: PropTypes.func.isRequired,
    loadAllLotInfo: PropTypes.func.isRequired,
    lotBucket: PropTypes.string.isRequired,
    lot: PropTypes.object.isRequired, // eslint-disable-line
    navigator: PropTypes.object.isRequired, // eslint-disable-line
    checkInLots: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    trip: PropTypes.object.isRequired, // eslint-disable-line
    connectionStatus: PropTypes.bool.isRequired,
    isAwaitingSync: PropTypes.bool.isRequired,
  };
  static isStartingForLot = false;
  constructor(props: any) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    this.state = {
      isLoading: false,
    };
  }

  componentWillMount() {
    const { lot: { dispatch_assignment_detail_id, lotStatus } } = this.props;
    this.props.loadAllLotInfo(dispatch_assignment_detail_id, lotStatus);
  }
  componentWillUnmount() {
    if (!this.isStartingForLot) {
      this.props.clearLotInfo();
    }
  }

  onNavigatorEvent = (event: Object) => {
    if (event.type === 'DeepLink') {
      const links = event.link.split('/');
      if (links[0] === 'refresh' && links[1] === 'lotView') {
        // FIXME: Somehow update the lotview instead of popping to lot list
        // const { lot } = this.props;
        // this.props.loadAllLotInfo(lot.dispatch_assignment_detail_id, lot.lotStatus);
        this.props.navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: 'Issue resolved successfully!',
          },
          autoDismissTimerSec: 2.0,
        });
        // this.setState({ isLoading: false });
        this.props.navigator.pop();
      }
      this.setState({ isLoading: true });
      if (links[0] === 'popTo' && links[1] === 'lotList') {
        setTimeout(() => this.props.navigator.pop(), 800);
      }
    }

    switch (event.id) {
      case 'signout':
        this.props.signoutUser();
        break;
      default:
        console.log('unhandled event', event.id); // eslint-disable-line
    }
  };

  handleStartPress = () => {
    const { lot, navigator } = this.props;
    this.isStartingForLot = true;
    this.props.startForLot(lot, navigator);
  };

  handleOnPressPickupOrder = () => {
    const {
      connectionStatus,
      lotBucket,
      inProgressCache,
      lot: { dispatch_assignment_detail_id },
    } = this.props;

    const hasStartedForm =
      lotBucket === 'inProgress' && inProgressCache[dispatch_assignment_detail_id];
    const isAwaitingSync =
      lotBucket === 'inProgress' &&
      inProgressCache[dispatch_assignment_detail_id] &&
      inProgressCache[dispatch_assignment_detail_id].isAwaitingSync;

    const edit = { text: 'Edit', onPress: () => this.openForm() };
    const restart = { text: 'Restart', onPress: () => this.openForm(true), style: 'destructive' };
    const submit = { text: 'Submit', onPress: () => this.syncForm() };
    const cancel = { text: 'Cancel', onPress: () => null, style: 'cancel' };
    if (hasStartedForm) {
      let title;
      const message = 'What would you like to do?';
      let options;
      if (connectionStatus && isAwaitingSync) {
        title = 'Form is ready to submit';
        options = [cancel, edit, submit];
      } else if (!connectionStatus && isAwaitingSync) {
        title = 'Form is ready and waiting for sync';
        options = [cancel, restart, edit];
      } else {
        title = 'Form has already been started';
        options = [cancel, restart, edit];
      }
      Alert.alert(title, message, options);
    } else {
      this.openForm();
    }
  };
  openForm = (restart = false) => {
    const { lot, lotInfo, charges, navigator } = this.props;
    const goBackFromLotView = () => navigator.pop();
    navigator.showModal({
      screen: 'CopartTransporter.LotNotes',
      title: 'Lot Notes',
      passProps: {
        tripType: lot.tripType,
        lot,
        charges: charges.data,
        goBackFromLotView,
        buttonLabel: 'Proceed',
        handleButtonPress: (navi) => {
          navi.push({
            screen: 'CopartTransporter.PickupForm',
            title: getLotTripTypeInfo(lot).formViewTitle,
            overrideBackPress: true,
            backButtonHidden: true,
            passProps: {
              // lot,
              lot: { ...lotInfo.data, ...lot },
              charges: charges.data,
              goBackFromLotView: this.props.goBackFromLotView,
              restart,
            },
          });
        },
      },
    });
  };
  syncForm = () => {
    this.props.navigator.showModal({
      screen: 'CopartTransporter.SyncingView',
      title: 'Syncing',
      overrideBackPress: true,
      backButtonHidden: true,
      passProps: {
        lotsToSync: [this.props.lot.dispatch_assignment_detail_id],
        goBack: () => {
          this.props.navigator.pop();
        },
      },
    });
  };

  handleInfoPressed = () => {
    const { lot } = this.props;
    this.props.navigator.showModal({
      screen: 'CopartTransporter.LotInfoView',
      title: 'Lot Info',
      passProps: {
        lot,
      },
    });
  };

  handleOnPressEmail = () => {
    this.props.navigator.showModal({
      screen: 'CopartTransporter.EmailInformation',
      title: 'Email Information',
      navigatorStyle: defaultNavStyles,
      passProps: {
        assignmentDetailId: this.props.lot.dispatch_assignment_detail_id,
      },
    });
  };

  handleOnPressUnableToPickup = () => {
    const { lot, navigator, lotBucket, charges } = this.props;
    navigator.showModal({
      screen: 'CopartTransporter.NewIssue',
      title: 'Can\'t Pickup',
      passProps: {
        entity: 'lot',
        bucket: lotBucket,
        data: lot,
        lot,
        lotBucket,
        charges,
      },
    });
  };

  handleOnSubmitForCheckin = () => {
    const { navigator, lot } = this.props;
    this.props.checkInLots({ [lot.dispatch_assignment_detail_id]: true }, navigator);
    navigator.pop();
  };

  handleNavigateToIssueDetail = () => {
    this.props.navigator.push({
      screen: 'CopartTransporter.IssuesLotDetail',
      title: 'Issue Lot',
      passProps: {
        lot: null,
        dispatchAssignmentDetailId: this.props.lot.dispatch_assignment_detail_id,
        comingFrom: 'raised',
        trip: this.props.trip,
        comingFromTripList: this.props.comingFromTripList,
      },
    });
  };

  render() {
    const renderIfOffline = renderIf(!this.props.connectionStatus);
    const {
      lot,
      charges,
      lotInfo,
      isLoading,
      lotBucket,
      inProgressCache,
      lot: { dispatch_assignment_detail_id },
    } = this.props;
    const isAwaitingSync =
      lotBucket === 'inProgress' &&
      inProgressCache[dispatch_assignment_detail_id] &&
      inProgressCache[dispatch_assignment_detail_id].isAwaitingSync;
    if (isLoading || this.state.isLoading) {
      return <FullScreenLoader />;
    }

    return (
      <View style={{ flex: 1 }}>
        <ViewHeader
          lot={lot}
          lotNumber={this.props.lotNumber}
          lotStatus={lot.lotStatus}
          onNavigateToIssueDetail={this.handleNavigateToIssueDetail}
          onLotInfoPressed={this.handleInfoPressed}
          onPressEmail={this.handleOnPressEmail}
        />
        {renderIfOffline(<OfflineBanner />)}
        <LotHeaderInfo
          lot={lot}
          vehicleType={lot.vehicleType}
        />
        <ScrollView style={{ alignSelf: 'stretch', backgroundColor: '#f9f7f7', padding: 10 }}>
          <LocationInformation lot={lot} />
          <AdvancesAndPickupInformation
            lot={lot}
            charges={charges}
          />
          <TripNotes
            lot={lot}
            lotInfo={lotInfo}
          />
        </ScrollView>
        <LotActionsButton
          lot={lot}
          lotStatus={lot.lotStatus}
          hasIssue={lot && lot.active_issue_flag === 'Yes'}
          isAwaitingSync={isAwaitingSync}
          tripType={lot.tripType}
          onPressStart={this.handleStartPress}
          onPressPickupOrder={this.handleOnPressPickupOrder}
          onPressUnableToPickup={this.handleOnPressUnableToPickup}
          onPressSubmitCheckin={this.handleOnSubmitForCheckin}
        />
        <ToolTip
          page="lotview"
          navigator={this.props.navigator}
        />
      </View>
    );
  }
}

const mapDispatchToProps = {
  startForLot,
  loadAllLotInfo,
  cacheLotData,
  getLotCharges,
  checkInLots,
  clearLotInfo,
};

export default connect(lotviewSelector, mapDispatchToProps)(LotView);
