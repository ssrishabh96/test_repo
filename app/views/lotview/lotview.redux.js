// @flow
// import { ReducerState, Action } from './types';
// import { LotItemType } from './components/LotItem/types';
import { createStructuredSelector } from 'reselect';

import { pathOr, propOr, compose } from 'ramda';

import { getConnectionStatus } from 'views/settings/settings.redux';
import { getCacheForCurrentUser } from 'views/pickupform/pickupform.redux';

import {
  initialState,
  MOVE_TO_INPROGRESS_REQUESTED,
  MOVE_TO_INPROGRESS_RESPONDED,
  LOT_CHARGES_REQUESTED,
  LOT_CHARGES_RESPONDED,
  LOT_INFO_REQUESTED,
  LOT_INFO_RESPONDED,
  LOT_INFO_RESPONDED_ERROR,
  LOT_NOTES_REQUESTED,
  LOT_NOTES_RESPONDED,
  CLEAR_LOT_INFO,
} from './lotview.constants';

export const lotviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case MOVE_TO_INPROGRESS_REQUESTED:
      return {
        ...state,
        isLoading: true,
      };
    case MOVE_TO_INPROGRESS_RESPONDED:
      return {
        ...state,
        isLoading: false,
      };
    case LOT_CHARGES_REQUESTED:
      return {
        ...state,
        charges: { isLoading: true, data: {} },
      };
    case LOT_CHARGES_RESPONDED:
      return {
        ...state,
        charges: { isLoading: false, data: action.charges },
      };
    case LOT_INFO_REQUESTED:
      return {
        ...state,
        lotInfo: { isLoading: true, data: {} },
      };
    case LOT_INFO_RESPONDED:
      return {
        ...state,
        lotInfo: { isLoading: false, data: action.lotInfo },
      };
    case LOT_INFO_RESPONDED_ERROR:
      return {
        ...state,
        lotInfo: { isLoading: false, data: {} },
      };
    case LOT_NOTES_REQUESTED:
      return {
        ...state,
        lotNotes: { isLoading: true, data: [] },
      };
    case LOT_NOTES_RESPONDED:
      return {
        ...state,
        lotNotes: { isLoading: false, data: action.lotNotes },
      };
    case CLEAR_LOT_INFO:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const getIsLoading = pathOr(false, ['lotview', 'isLoading']);
const getCharges = pathOr({}, ['lotview', 'charges']);
export const getLotNotes = pathOr({}, ['lotview', 'lotNotes']);
const getLotInfo = pathOr({}, ['lotview', 'lotInfo']);

const getLotListCache = pathOr({}, ['lotlist', 'cache']);
export const getLotInfoFromCache = assignmentDetailId =>
  compose(propOr(null, assignmentDetailId), getLotListCache);

// const otherInfo = getLotInfoFromCache(props.lot.dispatch_assignment_detail_id)(state);
export const lotviewSelector = createStructuredSelector({
  connectionStatus: getConnectionStatus,
  isLoading: getIsLoading,
  charges: getCharges,
  notes: getLotNotes,
  lotInfo: getLotInfo,
  inProgressCache: getCacheForCurrentUser,
  // ...otherInfo,
});

export const lotNotesViewSelector = createStructuredSelector({
  notes: compose(propOr([], 'data'), getLotNotes),
  isLoading: compose(propOr([], 'isLoading'), getLotNotes),
});

export const lotInfoSelector = createStructuredSelector({
  lotInfo: getLotInfo,
});
