// @flow

import type { Lot } from 'types/Lot';
import type { Issue } from 'types/Issue';

export type IssueViewProps = {
  navigator: Object,
  entity: 'lot' | 'trip',
  comingFromTripList?: boolean,
  bucket: string,
  data: Array<Object>,
  isLoading: boolean,
  fetchNewIssueReasons: (dispatchAssignmentDetailId: number, navigator: Object) => void,
};

export type SubIssueState = {
  checkedIssueId: ?string,
  showTextBox: boolean,
  otherIssueText: string,
  tripRejectReason: string,
};

export type SubIssueViewProps = {
  navigator: Object,
  lotBucket: string,
  lot: Lot,
  issue: Issue,
  isLoading: boolean,
  showTextBox?: boolean,
  entity: 'lot' | 'trip',
  comingFromTripList?: boolean,
  bucket: string,
  data: any,
  charges: Object,
  checkedIssueId: number,
  setCheckedIssueId: (id: number) => null,
  resetCheckedIssueId: () => null,
  submitIssueForLot: (
    lot: Lot | Object,
    bucket: string,
    issue: SubmitIssueType,
    goBackToListView: Function,
    navigator: Object,
  ) => null,
  declineTrips: (
    selectedTripIds: Object,
    issueToSubmit: SubmitIssueType,
    goBackToListView: Function,
    navigator: Object,
  ) => null,
  tripAction: (
    selectedTrips: Array<string>,
    response: string,
    params: Object,
    navigator: Object,
    goBackToListView?: Function,
  ) => any,
};

export type SubmitIssueType =
  | DeclineTripType
  | RaiseIssueType
  | typeof undefined
  | { notification: false };

export type DeclineTripType = {
  decline_reason: string,
  comments?: string,
};

export type RaiseIssueType = {
  type: string,
  subtype?: string,
  comments?: string,
  additional_data?: Object,
};
