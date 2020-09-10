import { renameKeys } from 'utils/commonUtils';

const countsMap = {
  assigned: 'assignedTrips',
  acknowledged: 'acceptedTrips',
  inprogress: 'inProgress',
  intransit: 'inTransit',
  completed: 'completed',
  declined_trips: 'declinedTrips',
  issues: 'issues',
};

export const mapHomeCountsResponse = renameKeys(countsMap);
