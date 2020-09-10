import { Navigation } from 'react-native-navigation';
import { pathOr } from 'ramda';

import HomeScreen from 'views/home';
import Signup from 'views/signup';
import TermsAndConditions from 'views/termsandconditions';
import Login from 'views/login';
import ChangePassword from 'views/login/changePassword.view';
import ForgotPassword from 'views/login/forgotPassword.view';
import LotView from 'views/lotview';
import LotInfoView from 'views/lotview/lotInfo.view';
import AssignToList from 'views/assigntolist';
import NewIssue from 'views/newissue';
import Settings from 'views/settings';
import Languages from 'views/settings/Languages';
import ProfileSelection from 'views/settings/profileSelection.view';
import Distributed from 'views/distributed';

import Notification from 'components/core/Notification';

import UpdateProfile from 'views/updateDriver/UpdateProfile.view';
import DriverForm from 'views/usermanagementform/driverform.view';
import DriverDetail from 'views/usermanagement/driverdetail.view';
import GroupsDriversListView from 'views/usermanagement/driverlist.view';
import DriverProfile from 'views/driverprofile';
import PickupNotes from 'views/pickupNotes';

import AssignedTrips from 'views/trips/assignedTrips.view';
import AcceptedTrips from 'views/trips/acceptedTrips.view';

import FilterView from 'views/filter';

import IssuesQueueContainer from '../views/issuesqueue';
import IssuesLotDetail from '../views/issuesqueue/issuesqueuelotdetail.view';

import DeclinedTripsView from 'views/declinedtrips';
import DeclinedTripDetailView from 'views/declinedtrips/declinedtripdetail.view';

// import LotList from '../views/lotlist';
import { withLazySelectors, LotListView } from '../views/lotlist/lotlistContainer';
import GlobalSearch from '../views/lotlist/searchModal.view';
// import InProgressLotList from '../views/lotlist/inprogress.view';
// import InTransitLotList from '../views/lotlist/intransit.view';

import SyncingView from '../views/syncingformview';

import PickupForm from '../views/pickupform';
import ChildData from '../views/pickupform/components/ChildData/';
import Onboarding from '../views/onboarding';
import SignatureView from '../views/pickupform/components/SignatureView/';
import MapView from '../views/lotlist/components/MapView';
import LotNotes from '../views/lotnotes/';

import UserManagement from '../views/usermanagement';
import GroupPicker from '../views/usermanagementform/components/GroupPicker';
import CountryPicker from '../views/usermanagementform/components/CountryPicker';
import StatePicker from '../views/usermanagementform/components/StatePicker';

import NavVectorIconBtnGroup from '../components/custom/NavVectorIconBtnGroup';
import ScannerView from '../views/pickupform/components/ScannerView/';
// import ForgotPasswordForm from '../views/login/components/forgotPasswordForm';

import SubIssueView from '../views/newissue/subissue.view';
import ChargesPickerList from '../views/newissue/components/ChargesOverLimit/ChargePickerList';
import LotViewIssuesRow from '../views/lotview/components/IssuesRow';

import withOfflineBucket from 'views/offline/';

import EmailInformation from '../views/lotview/components/EmailInformation';

import YardsList from 'views/usermanagement/components/YardsList';

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent('CopartTransporter.Home', () => HomeScreen, store, Provider);
  Navigation.registerComponent('CopartTransporter.Signup', () => Signup, store, Provider);
  Navigation.registerComponent(
    'CopartTransporter.TermsAndConditions',
    () => TermsAndConditions,
    store,
    Provider,
  );
  Navigation.registerComponent('CopartTransporter.Login', () => Login, store, Provider);
  Navigation.registerComponent(
    'CopartTransporter.Distributed',
    () => withOfflineBucket(Distributed),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.ChangePassword',
    () => withOfflineBucket(ChangePassword),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.ForgotPassword',
    () => withOfflineBucket(ForgotPassword),
    store,
    Provider,
  );
  Navigation.registerComponent('CopartTransporter.PickupForm', () => PickupForm, store, Provider);
  Navigation.registerComponent('CopartTransporter.ChildData', () => ChildData, store, Provider);
  Navigation.registerComponent('CopartTransporter.Signature', () => SignatureView, store, Provider);
  Navigation.registerComponent('CopartTransporter.ScannerView', () => ScannerView, store, Provider);
  Navigation.registerComponent('CopartTransporter.LotNotes', () => LotNotes, store, Provider);
  Navigation.registerComponent('CopartTransporter.PickupNotes', () => PickupNotes, store, Provider);
  Navigation.registerComponent('CopartTransporter.Onboarding', () => Onboarding, store, Provider);
  Navigation.registerComponent(
    'CopartTransporter.ShowInAppNotification',
    () => Notification,
    store,
    Provider,
  );
  Navigation.registerComponent('CopartTransporter.MapView', () => MapView, store, Provider);
  Navigation.registerComponent(
    'CopartTransporter.NavVectorIconBtnGroup',
    () => NavVectorIconBtnGroup,
  );
  // stories
  Navigation.registerComponent(
    'CopartTransporter.UserManagement',
    () => withOfflineBucket(UserManagement),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.GroupsDriversListView',
    () => GroupsDriversListView,
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.AssignedRun',
    () => withOfflineBucket(AssignedTrips),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.AcknowledgedRun',
    () => withOfflineBucket(AcceptedTrips),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.IssuesQueue',
    () => withOfflineBucket(IssuesQueueContainer),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.IssuesLotDetail',
    () => withOfflineBucket(IssuesLotDetail),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.DeclinedTripsView',
    () => withOfflineBucket(DeclinedTripsView),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.DeclinedTripDetail',
    () => withOfflineBucket(DeclinedTripDetailView),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.InProgressRun',
    // () => withOfflineBucket(withLazySelectors('inProgress', pathOr([], ['lotlist', 'inProgress']))),
    () => withLazySelectors('inProgress', pathOr([], ['lotlist', 'inProgress'])),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.InTransit',
    () => withOfflineBucket(withLazySelectors('inTransit', pathOr([], ['lotlist', 'inTransit']))),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.Completed',
    () => withOfflineBucket(withLazySelectors('completed', pathOr([], ['lotlist', 'completed']))),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.LotList',
    () => withOfflineBucket(LotListView),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.GlobalSearch',
    () => withOfflineBucket(GlobalSearch),
    store,
    Provider,
  );
  Navigation.registerComponent('CopartTransporter.FilterView', () => FilterView, store, Provider);
  Navigation.registerComponent('CopartTransporter.LotList', () => LotListView, store, Provider);
  Navigation.registerComponent('CopartTransporter.LotView', () => LotView, store, Provider);
  Navigation.registerComponent(
    'CopartTransporter.LotViewIssuesRowModal',
    () => withOfflineBucket(LotViewIssuesRow),
    store,
    Provider,
  );

  Navigation.registerComponent('CopartTransporter.LotInfoView', () => LotInfoView, store, Provider);
  Navigation.registerComponent(
    'CopartTransporter.AssignToList',
    () => withOfflineBucket(AssignToList),
    store,
    Provider,
  );
  Navigation.registerComponent('CopartTransporter.PickupForm', () => PickupForm, store, Provider);
  Navigation.registerComponent('CopartTransporter.NewIssue', () => NewIssue, store, Provider);
  Navigation.registerComponent(
    'CopartTransporter.SubIssueView',
    () => withOfflineBucket(SubIssueView),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.ChargesOverLimitChargePicker',
    () => ChargesPickerList,
    store,
    Provider,
  );

  Navigation.registerComponent(
    'CopartTransporter.DriverForm',
    () => withOfflineBucket(DriverForm),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.UpdateDriverProfile',
    () => withOfflineBucket(UpdateProfile),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.DriverDetail',
    () => withOfflineBucket(DriverDetail),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.YardsList',
    () => withOfflineBucket(YardsList),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.NewDriverGroupPicker',
    () => withOfflineBucket(GroupPicker),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.CountryPicker',
    () => CountryPicker,
    store,
    Provider,
  );
  Navigation.registerComponent('CopartTransporter.StatePicker', () => StatePicker, store, Provider);
  Navigation.registerComponent('CopartTransporter.Settings', () => Settings, store, Provider);
  Navigation.registerComponent(
    'CopartTransporter.Settings.Languages',
    () => Languages,
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.Settings.ProfileSelection',
    () => ProfileSelection,
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.DriverProfile',
    () => withOfflineBucket(DriverProfile),
    store,
    Provider,
  );
  Navigation.registerComponent(
    'CopartTransporter.EmailInformation',
    () => EmailInformation,
    store,
    Provider,
  );
  Navigation.registerComponent('CopartTransporter.SyncingView', () => SyncingView, store, Provider);
}
