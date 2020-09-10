/**
 * @flow
 */

import type { Trip } from 'types/Trip';
import type { RNNNavigator } from 'types/RNNavigation';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, Alert, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import renderIf from 'render-if';
import ActionButton from 'react-native-action-button';

import { getUserRole } from 'views/login/login.redux';
import {
  removePersonnel,
  overrideTripRejection,
  takeTripBackAndAccept,
} from './declinedtriplist.actions';

import ViewHeader from './components/ViewHeader';
import RoundButton from './components/RoundButton';
import OverrideDeclineModal from './components/OverrideDeclineModal';
import Submit from 'components/core/Button';

import { GROUP_MANAGER } from 'constants/user/roles';
import Locale from 'utils/locale';
import colors from 'styles/colors';
import icons from 'constants/icons';
import { getPropNameForLbl } from 'utils/commonUtils';
import { defaultNavStyles, LoadingIndicator } from 'styles';

type Props = {
  trip: Trip, // TODO: Update type to match DeclinedTrip item
  navigator: RNNNavigator,
  overrideTripRejection: (
    tripId: number,
    overrideReason: string,
    navigator: RNNNavigator,
    isLoadingCb: () => void,
  ) => void,
  takeTripBackAndAccept: (navigator: Object, tripIds: Array<number>) => Promise<any>,
  removePersonnel: (tripIds: Array<number>, navigator: RNNNavigator) => void,
  comingFrom: string,
  role: 1 | 2 | 3,
};

type State = {
  overrideReason: string,
  isLoading: boolean,
  isSubmitting: boolean,
  isOverrideModalVisible: boolean,
  distributeOpen: boolean,
  distributeClose: boolean,
};

class DeclinedTripDetail extends Component<Props, State> {
  static navigatorStyle = defaultNavStyles;

  constructor(props: Props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  state = {
    isSubmitting: false,
    isLoading: false,
    overrideReason: '',
    isOverrideModalVisible: false,
    distributeOpen: false,
    distributeClose: false,
  };

  onNavigatorEvent = (event: Object) => {
    if (event.type === 'DeepLink') {
      const links = event.link.split('/');
      if (links && links[0] === 'popTo' && links[1] === 'declinedTripList') {
        this.props.navigator.pop();
      }
    }
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

  getTripRejectionReason = (value: string) => {
    if (!value) {
      return null;
    }
    if (value.substring(0, 5) === 'Other') {
      // return value.substring(8).length === 0 ? value : value.substring(8);
      return 'Other';
    }
    return value;
  };

  handleOnPressOverrideRejection = () => {
    const { overrideReason } = this.state;
    if (overrideReason === '' || !overrideReason || overrideReason.length === 0) {
      Alert.alert(
        Locale.translate('declinedTripDetail.overideAlert.title'),
        Locale.translate('declinedTripDetail.overideAlert.message'),
        [{ text: Locale.translate('declinedTripDetail.overideAlert.ok') }],
      );
      return;
    }
    this.setState({ isOverrideModalVisible: false, isLoading: true });
    const isLoadingCb = () => this.setState({ isLoading: false });
    this.props.overrideTripRejection(
      parseInt(this.props.trip.tripId, 10),
      overrideReason,
      this.props.navigator,
      isLoadingCb,
    );
  };

  handleChangePersonnel = (type: 'driver' | 'group') => {
    const closeFabCallback = () => {
      this.setState({
        distributeOpen: false,
        distributeClose: false,
      });
    };
    const { trip } = this.props;
    if (!type) {
      this.props.navigator.showInAppNotification({
        screen: 'CopartTransporter.ShowInAppNotification',
        passProps: {
          type: 'error',
          content: 'There was some problem. Please try again.',
        },
        autoDismissTimerSec: 2.0,
      });
      return;
    }
    this.props.navigator.showModal({
      screen: 'CopartTransporter.AssignToList',
      title: Locale.translate('AssignToList.title'),
      passProps: {
        type,
        mode: 'trips',
        closeFabCallback,
        comingFrom: 'declinedTrip',
        selected: {
          [trip.tripId]: true,
        },
      },
    });
  };

  handleTakeBack = (trip: Trip) => {
    this.setState({ isSubmitting: true });
    this.props
      .takeTripBackAndAccept(this.props.navigator, [parseInt(trip.tripId, 10)])
      .then((response: Object) => {
        if (response && response.status === 'success') {
          this.setState({ isSubmitting: false });
          this.props.navigator.pop();
          this.props.navigator.showInAppNotification({
            screen: 'CopartTransporter.ShowInAppNotification',
            passProps: {
              type: 'success',
              content: 'Trip Reclaimed and Accepted successfully!',
            },
            autoDismissTimerSec: 2.0,
          });
        }
      })
      .catch((error: Object) => {
        this.setState({ isSubmitting: false });
        this.props.navigator.pop();
        this.props.navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'error',
            content: `Error: ${JSON.stringify(error)}`,
          },
          autoDismissTimerSec: 2.0,
        });
      });
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

  handleRemovePersonnel = () => {
    const { trip } = this.props;
    const reportedAssignedValue = getPropNameForLbl(trip, 'assigned', 'responsiblePartyName');
    Alert.alert(
      'Warning',
      `Are you sure you want remove the personnel:\n${reportedAssignedValue ||
        Locale.translate('N/A')} ?`,
      [
        {
          text: 'Yes',
          onPress: () =>
            this.props.removePersonnel(
              [parseInt(this.props.trip.tripId, 10)],
              this.props.navigator,
            ),
        },
        {
          text: 'Cancel',
          onPress: () => {},
        },
      ],
    );
  };

  render() {
    const { trip, comingFrom } = this.props;
    const { distributeOpen, distributeClose, isLoading, isOverrideModalVisible } = this.state;
    const renderIfComingFromAssigned = renderIf(comingFrom === 'assigned');
    const renderIfComingFromRaised = renderIf(comingFrom === 'raised');
    const renderIfShowDistribute = renderIf(distributeOpen || distributeClose);
    const renderIfOverrideModalVisible = renderIf(isOverrideModalVisible);

    const OTHER_SUBSTR = trip.rejectionReason.substring(0, 5);
    const isOther = OTHER_SUBSTR === 'Other' && trip.rejectionReason.substring(8).length > 0;

    if (isLoading) {
      return <LoadingIndicator size={'large'} />;
    }
    return (
      <KeyboardAwareScrollView>
        <ViewHeader trip={trip} />
        <View
          style={{
            marginTop: 20,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Text style={{ flex: 0.4, fontWeight: 'bold', fontSize: 16 }}>
            {Locale.translate('declinedTripDetail.RejectionNotes')}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.GRAY_DARK,
              alignItems: 'flex-start',
              fontStyle: 'italic',
              flex: 0.6,
            }}
          >
            {isOther ? 'Other' : trip.rejectionReason}
          </Text>
        </View>
        <View style={{ padding: 20 }}>
          {renderIfComingFromRaised(
            <Submit
              isLoading={this.state.isSubmitting}
              style={[styles.submit]}
              titleStyle={styles.submitText}
              title="Take Back and Accept"
              onPress={() => this.handleTakeBack(this.props.trip)}
            />,
          )}
          {renderIfComingFromAssigned(
            <View>
              {/*
              - Reassign To (Driver || Group) => Override trip rejection
              - Change (Driver || Group) => Distribute trip to someone else
              - Remove (Driver || Group) => Remove personnel
              */}
              <RoundButton
                // style={{ flex: 0.5 }}
                onPress={() => this.setState({ isOverrideModalVisible: true })}
                btnLabel={`${Locale.translate('declinedTripDetail.OverideRejectionButton')} ${
                  trip && trip.vendorPersonnelId ? 'Driver' : 'Group'
                }`}
                btnColor={colors.COPART_BLUE}
              />
              <RoundButton
                // style={{ flex: 0.5 }}
                onPress={this.handleDistributeButton}
                btnLabel={'Change Driver/Group'}
                btnColor={colors.DARK_YELLOW}
              />
              <RoundButton
                onPress={() => this.handleRemovePersonnel()}
                btnLabel={`Remove ${trip && trip.vendorPersonnelId ? 'Driver' : 'Group'}`}
                btnColor={colors.DARK_RED}
              />
            </View>,
          )}
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
        {renderIfOverrideModalVisible(
          <OverrideDeclineModal
            isOverrideModalVisible={this.state.isOverrideModalVisible}
            updateOverrideDeclineText={value => this.setState({ overrideReason: value })}
            overrideReason={this.state.overrideReason}
            onOverrideRejection={this.handleOnPressOverrideRejection}
            onPressCancel={() => this.setState({ isOverrideModalVisible: false })}
            trip={trip}
          />,
        )}
      </KeyboardAwareScrollView>
    );
  }
}

const mapDispatchToProps = {
  removePersonnel,
  overrideTripRejection,
  takeTripBackAndAccept,
};

const mapStateToProps = (state: Object) => ({
  role: getUserRole(state),
});

const styles = StyleSheet.create({
  submit: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: colors.COPART_BLUE,
    borderRadius: 30,
  },
  submitText: { fontSize: 20, color: '#fff' },
});

export default connect(mapStateToProps, mapDispatchToProps)(DeclinedTripDetail);
