// @flow
import type { State, Action } from './home.type';

import { createStructuredSelector } from 'reselect';
import { pathOr } from 'ramda';

import { initialState, UPDATE_HOME_COUNTS, UPDATE_HOME_COUNTS_ERROR } from './home.constants';

import { getVendor, getUserRole } from 'views/login/login.redux';
import { getConnectionStatus } from 'views/settings/settings.redux';

export const homeReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case UPDATE_HOME_COUNTS:
      return {
        ...state,
        counts: action.counts,
      };
    case UPDATE_HOME_COUNTS_ERROR:
      return state;
    default:
      return state;
  }
};

const getCounts = pathOr('', ['home', 'counts']);
const getUser = pathOr('', ['login', 'user']);
const getEmail = pathOr('', ['login', 'email']);
const getSettings = pathOr('', ['settings']);
const getAssigned = pathOr([], ['trips', 'assigned', 'trips']);
const getAccepted = pathOr([], ['trips', 'accepted', 'trips']);
const getInProgressLots = pathOr([], ['lotlist', 'inProgress', 'lots']);
const getInTransitLots = pathOr([], ['lotlist', 'inTransit', 'lots']);
const getCompletedLots = pathOr([], ['lotlist', 'completed', 'lots']);
const getDeclinedTripsList = pathOr('', ['declinedtriplist', 'declinedtriplist', 'triplist']);
const getIssuesLotList = pathOr('', ['issuesqueue', 'lotlist', 'lotlist']);

export const homeSelector = createStructuredSelector({
  user: getUser,
  role: getUserRole,
  email: getEmail,
  activeVendor: getVendor,
  settings: getSettings,
  connectionStatus: getConnectionStatus,
  counts: getCounts,
  assignedTrips: getAssigned,
  acceptedTrips: getAccepted,
  inProgressLots: getInProgressLots,
  inTransitLots: getInTransitLots,
  completedLots: getCompletedLots,
  issues: getIssuesLotList,
  declinedTrips: getDeclinedTripsList,
});
