import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
import debounce from 'debounce';

import { getDefaultGroupId, getActiveVendor, getUserRole } from 'views/login/login.redux';
import { fetchData } from './assigntolist.action';
import { assignLots } from '../lotlist/lotlist.action';
import { distributeTrips } from '../trips/trips.actions';
import { resolveIssueOnLot, distributeIssueLot } from '../issuesqueue/issuesqueue.action';
import { assignToListSelector } from './assigntolist.redux';
import { USER_MANAGER as COMPANY_MANAGER } from 'constants/user/roles';

import FullScreenLoader from 'components/custom/FullScreenLoader';
import DriverList from './components/DriverList';
import GroupList from './components/GroupList';

import { defaultNavStyles } from 'styles';
import icons from 'constants/icons';

class AssignToList extends React.Component {
  static navigatorStyle = defaultNavStyles;

  static navigatorButtons = {
    leftButtons: [
      {
        icon: icons.tripsScreen.tripIconClose,
        id: 'closeModal',
      },
    ],
  };

  static propTypes = {
    type: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    comingFrom: PropTypes.string,
    fetchData: PropTypes.func.isRequired,
    assignLots: PropTypes.func.isRequired,
    resolveIssueOnLot: PropTypes.func.isRequired,
    distributeTrips: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired, // eslint-disable-line
    lot: PropTypes.object.isRequired, // eslint-disable-line
    selectedLots: PropTypes.object, // eslint-disable-line
    driversList: PropTypes.array.isRequired, // eslint-disable-line
    groupsList: PropTypes.array.isRequired, // eslint-disable-line
    navigator: PropTypes.object.isRequired, // eslint-disable-line
    driverGroupId: PropTypes.number,
    bucket: PropTypes.string,
    role: PropTypes.number,
    dispatchGroupId: PropTypes.number,
    selected: PropTypes.object, // eslint-disable-line
    tripStatus: PropTypes.string,
    tripId: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
    hasLotsLeft: PropTypes.bool,
    goBackIfNoLots: PropTypes.func,
    closeFabCallback: PropTypes.func,
    isLoading: PropTypes.bool,
    trip: PropTypes.object, // eslint-disable-line
    vendorId: PropTypes.number,
  };

  static defaultProps = {
    comingFrom: '',
    driverGroupId: null,
    bucket: null,
    role: -1,
    dispatchGroupId: -1,
    selected: {},
    tripStatus: '',
    tripId: -1,
    hasLotsLeft: false,
    goBackIfNoLots: () => {},
    closeFabCallback: () => {},
    isLoading: false,
    trip: {},
    vendorId: -1,
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentDidMount() {
    this.props.fetchData(this.props.driverGroupId);
  }

  onNavigatorEvent = (event) => {
    if (event.id === 'closeModal') {
      if (typeof this.props.closeFabCallback === 'function') {
        this.props.closeFabCallback();
      }
      this.props.navigator.dismissModal({
        animationType: 'slide-down',
      });
    }
  };

  handlePress = debounce(
    (assigneeId) => {
      const { type, mode, navigator, lot, role, comingFrom, dispatchGroupId } = this.props;

      let assignee = null;
      if (type === 'driver') {
        assignee = {
          personnel_id: assigneeId,
          group_id: role === COMPANY_MANAGER ? dispatchGroupId : null,
        };
      } else {
        assignee = { group_id: assigneeId };
      }

      if (mode === 'trips') {
        const { selected } = this.props;
        this.props.distributeTrips(assignee, selected, comingFrom, navigator);
      } else if (mode === 'lots') {
        const {
          selectedLots,
          tripStatus,
          tripId,
          hasLotsLeft,
          goBackIfNoLots,
          bucket,
        } = this.props;
        if (comingFrom === 'declinedTrip') {
          this.props.navigator.dismissModal();
        }
        this.props.assignLots(
          selectedLots,
          assignee,
          tripStatus,
          tripId,
          bucket,
          hasLotsLeft,
          navigator,
          goBackIfNoLots,
          comingFrom,
        );
      } else if (mode === 'issue') {
        const payload = {
          tow_provider: {
            vendor_id: this.props.vendorId,
            group_id: this.props.dispatchGroupId,
            personnel_id: assigneeId,
          },
        };
        this.props.resolveIssueOnLot(
          'change_driver',
          lot.dispatchAssignmentDetailId,
          payload,
          comingFrom,
          navigator,
          true, // dismissModal
        );
      } else if (mode === 'trip_maintenance') {
        const payload = {
          resolution_action: 'trip_maintenance',
          tow_provider: {
            vendor_id: this.props.vendorId,
            ...assignee,
          },
        };
        navigator.dismissModal();

        this.props
          .distributeIssueLot(lot.dispatchAssignmentDetailId, payload, navigator)
          .then((response) => {
            this.props.closeFabCallback && this.props.closeFabCallback();
          })
          .catch((error) => {
            this.props.closeFabCallback && this.props.closeFabCallback();
          });
      }
    },
    400,
    true,
  );

  render() {
    const { type, isLoading, driversList, groupsList } = this.props;
    const renderIfDriverType = renderIf(type === 'driver');
    const renderIfGroupType = renderIf(type === 'group');

    if (isLoading) {
      return <FullScreenLoader />;
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {renderIfDriverType(<DriverList
          data={driversList}
          onDriverItemPress={this.handlePress}
        />)}
        {renderIfGroupType(<GroupList
          data={groupsList}
          onGroupItemPress={this.handlePress}
        />)}
      </View>
    );
  }
}

const mapStateToProps = (state: Object) => ({
  ...assignToListSelector(state),
  dispatchGroupId: getDefaultGroupId(state),
  vendorId: getActiveVendor(state),
  role: getUserRole(state),
});

const mapDispatchToProps = {
  fetchData,
  assignLots,
  distributeTrips,
  resolveIssueOnLot,
  distributeIssueLot,
  // changeDriverForDeclinedTrip,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignToList);
