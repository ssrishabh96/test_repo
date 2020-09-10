import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { homeReducer } from '../views/home/home.redux';
import { signupReducer } from '../views/signup/signup.redux';
import { loginReducer } from '../views/login/login.redux';
import userManagementReducer from '../views/usermanagement/usermanagement.redux';
import userManagementFormReducer from '../views/usermanagementform/usermanagementform.redux';
import { lotListReducer } from '../views/lotlist/lotlist.redux';
import { lotviewReducer } from '../views/lotview/lotview.redux';
import { tripsReducer } from '../views/trips/trips.redux';
import { assignToListReducer } from '../views/assigntolist/assigntolist.redux';
import { raiseIssueReducer } from '../views/newissue/newissue.redux';
import issuesQueueReducer from '../views/issuesqueue/issuesqueue.redux';
import declinedTripsListReducer from '../views/declinedtrips/declinedtriplist.redux';
import settingsReducer from '../views/settings/settings.redux';
import { pickUpFormReducer } from '../views/pickupform/pickupform.redux';
import { driverProfileReducer } from 'views/driverprofile/driverprofile.redux';

export default combineReducers({
  home: homeReducer,
  assigntolist: assignToListReducer,
  declinedtriplist: declinedTripsListReducer,
  driverProfile: driverProfileReducer,
  form: formReducer,
  raiseIssueReasons: raiseIssueReducer,
  issuesqueue: issuesQueueReducer,
  login: loginReducer,
  lotview: lotviewReducer,
  lotlist: lotListReducer,
  pickUpForm: pickUpFormReducer,
  settings: settingsReducer,
  signup: signupReducer,
  trips: tripsReducer,
  userManagement: userManagementReducer,
  userManagementForm: userManagementFormReducer,
});
