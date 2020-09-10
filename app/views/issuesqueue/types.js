import { Lot } from 'types/Lot';
import { RNNNavigator } from 'types/RNNavigation';

import {
  REQUEST_ISSUES_LOT_LIST,
  REQUEST_ISSUES_LOT_LIST_SUCCESS,
  REQUEST_ISSUES_LOT_LIST_FAILURE,
} from './issuesqueue.constants';

export type State = {
  distributeOpen: boolean,
  distributeClose: boolean,
};

export type IssuesLotDetailViewProps = {
  navigator: RNNNavigator,
  dispatchAssignmentDetailId?: number,
  clearIssue: (lot: Lot, assigneeId: number, navigator: RNNNavigator) => void,
  cannotClearLot: (lot: Lot, navigator: RNNNavigator) => void,
  fetchIssueLotDetail: (assignmentDetailId: number) => void,
  resolveIssueOnLot: (
    action: string,
    assignmentDetailId: number,
    params: Object,
    listType: string,
    navigator: RNNNavigator,
    dismissModal?: boolean,
    updateLotList?: () => void,
  ) => void,
};

export type ReducerState = {
  +isLoading: {
    raised: boolean,
    assigned: boolean,
    partialTripLots: boolean,
  },
  +error: Object,
  +assigned: Array<Object>,
  +raised: Array<Object>,
  +partialTripLots: Array<Object>,
};

export type RequestIssuesLotList = {
  type: REQUEST_ISSUES_LOT_LIST,
};

export type RequestIssuesLotListSuccess = {
  type: REQUEST_ISSUES_LOT_LIST_SUCCESS,
  lotlist: Array<Lot>,
};

export type RequestIssuesLotListFailure = {
  type: REQUEST_ISSUES_LOT_LIST_FAILURE,
};

export type Action =
  | RequestIssuesLotList
  | RequestIssuesLotListFailure
  | RequestIssuesLotListSuccess;

type PromiseAction = Promise<Action>;
export type GetState = Function; // TODO: add proper flow types for Redux-Store
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
