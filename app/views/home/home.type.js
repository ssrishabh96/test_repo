// @flow

import type { Trip } from 'types/Trip';
import type { Lot } from 'types/Lot';
import type { RNNNavigator } from 'types/RNNavigation';

export type HomeCounts = {
  [key: string]: number,
};
export type State = {
  +counts: HomeCounts,
};

export type Action = {
  type: string,
};

export type HomeScreenProps = {
  +navigator: RNNNavigator,
  +user: Object,
  +assignedTrips: Array<Lot>,
  +declinedTrips: Array<Trip>,
  +acceptedTrips: Array<Lot>,
  +inProgressLots: Array<Lot>,
  +inTransitLots: Array<Lot>,
  +completedLots: Array<Lot>,
  +issues: Array<Lot>,
  +settings: Object,
  +connectionStatus: boolean,
  +counts: Object,
  +getHomeScreenCounts: () => void,
  +signoutUser: () => void,
  +setActiveProfile: () => void,
  +changeCurrentVehicle: () => void,
};
