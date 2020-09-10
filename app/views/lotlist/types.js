// @flow

import type { Lot } from 'types/Lot';
import {
  SET_MULTISELECT_MODE,
  RESET_MULTISELECT_MODE,
  TOGGLE_SELECTION,
  CLEAR_SELECTION,
  ADD_TO_INPROGRESS,
  ADD_TO_INTRANSIT,
  SUBMIT_ISSUE_SUCCESS,
  SUBMIT_ISSUE_INIT,
  SUBMIT_ISSUE_FAILURE,
  TOGGLE_SEARCHBAR,
  FILTER_WITH_QUERY,
} from './lotlist.constants';

export type Props = {
  +connectionStatus: true | false,
  +isLoading: true | false,
  +isLoadingNextpage: true | false,
  +selectedLots: {
    [number]: boolean,
  },
  +navigator: Object,
  +multiselect: {
    active: number,
    type: string,
  },
  +visible: true | false,
  +search: {
    isSearchBarVisible: true | false,
    result: any,
  },
  +tripId: string | number,
  +item: any,
  +tripStatus: string,
  +type: string,
  +lotList: Array<Lot>,
  hasIssue: boolean,
  +setCurrentLotList: (lotList: Array<Lot>) => any,
  +toggleSelection: (lotNumber: number) => any,
  +setMultiselectMode: (type: string) => any,
  +resetMultiselectMode: () => any,
  +checkInLots: (lotNumbers: Object, navigation: Object) => any,
  +filterWithQuery: (query: string, lots?: Array<Lot>) => any,
  +activateSearch: () => any,
  +deactivateSearch: () => any,
  +resetSearch: () => any,
  +hideSearch: () => any,
  +sendResponse: (
    trips?: ?any,
    response?: ?string,
    resetMultiselect?: boolean,
    navigator: Object,
  ) => any,
  +inProgressCache: {
    [string]: {
      lot: Lot,
      images: Object,
      isAwaitingSync: true | false,
    },
  },
};

export type CheckinButtonsProps = {
  +onPress: () => any,
};

export type ReducerState = {
  +trip?: Object, // TODO: Add complete structure
  +multiselect: {
    active: number,
    type: string,
  },
  +selectedLots: Array<{ [number]: boolean }>,
  +isLoading?: true | false,
  +error?: { message: string } | string,
  +lotList: Array<Lot>,
  +inProgress: Array<Lot>,
  +inTransit: Array<Lot>,
  +completed: Array<Lot>,
  +isSearchIconSelected: true | false,
};

export type ResetMultiselectModeAction = {
  type: RESET_MULTISELECT_MODE,
};
export type SetMultiSelectModeAction = {
  type: SET_MULTISELECT_MODE,
  active: boolean,
  multiselectType: string,
};
export type ToggleSelectionAction = {
  type: TOGGLE_SELECTION,
  lotNumber: string,
};
export type ClearSelectionAction = {
  type: CLEAR_SELECTION,
};
export type AddToInprogress = {
  type: ADD_TO_INPROGRESS,
  lot: Lot,
};
export type AddToIntransit = {
  type: ADD_TO_INTRANSIT,
  lot: Lot,
};
export type ToggleSearchIconSelection = {
  type: FILTER_WITH_QUERY,
};
export type ToggleSearch = {
  type: TOGGLE_SEARCHBAR,
};

export type SubmitIssueInit = {
  type: SUBMIT_ISSUE_INIT,
};

export type SubmitIssueSuccess = {
  type: SUBMIT_ISSUE_SUCCESS,
  lotBucket: string,
  lotList: Array<Lot>,
};

export type SubmitIssueFailure = {
  type: SUBMIT_ISSUE_FAILURE,
  error: {
    message: string,
  },
};

export type Action =
  | ResetMultiselectModeAction
  | SetMultiSelectModeAction
  | ToggleSelectionAction
  | ClearSelectionAction
  | AddToInprogress
  | AddToIntransit
  | SubmitIssueInit
  | SubmitIssueSuccess
  | SubmitIssueFailure
  | ToggleSearchIconSelection
  | ToggleSearch;

type PromiseAction = Promise<Action>;
export type GetState = () => ReducerState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
