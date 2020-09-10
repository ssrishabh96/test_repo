import { combineReducers } from 'redux';
import { pathOr } from 'ramda';
import { createStructuredSelector } from 'reselect';

import {
  initialState,
  FETCH_COUNTRIES_LIST,
  FETCH_STATES_LIST,
} from './usermanagementform.constants';

export const userManagementRootSelector = createStructuredSelector({
  states: pathOr({}, ['userManagementForm', 'userManagementRoot', 'states']),
  countries: pathOr({}, ['userManagementForm', 'userManagementRoot', 'countries']),
});

const userManagementRootReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COUNTRIES_LIST:
      return {
        ...state,
        countries: action.data,
      };
    case FETCH_STATES_LIST:
      return {
        ...state,
        states: action.data,
      };
    default:
      return state;
  }
};

// Keeping this combineReducers function - as we might need it
// to preload initial states for form edits.
const userManagementReducer = combineReducers({
  userManagementRoot: userManagementRootReducer,
});

export default userManagementReducer;
