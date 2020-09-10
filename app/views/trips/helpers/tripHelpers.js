import {
  __,
  map,
  when,
  prop,
  propEq,
  compose,
  reject,
  evolve,
  isEmpty,
  differenceWith,
  filter,
  chain,
  keys,
  pickBy,
  equals,
  pick,
  reduce,
  merge,
  defaultTo,
  sum,
  length,
  any,
  not,
  find,
} from 'ramda';

const removeLotItem = lotNumber => reject(propEq('number', lotNumber));
const hasNoLots = compose(isEmpty, prop('lots'));
const removeTripsWithEmptyLots = reject(hasNoLots);
export const matchesTripId = propEq('tripId');
export const removeLotForTrip = lot =>
  compose(
    removeTripsWithEmptyLots,
    map(when(matchesTripId(lot.tripId), evolve({ lots: removeLotItem(lot.number) }))),
  );

const matchesLotNumber = (a, b) => a.number === b;
// will remove smallList Items from BigList differenceWith(predicate, bigList, smallList)
const removeLotsFromTripLots = differenceWith(matchesLotNumber);
export const removeMultipleLotsFromTrip = (lotNumbers, tripId) =>
  compose(
    removeTripsWithEmptyLots,
    map(when(matchesTripId(tripId), evolve({ lots: removeLotsFromTripLots(__, lotNumbers) }))),
  );

export const getTripId = prop('tripId');
export const flattenLots = chain(prop('lots'));

export const getSelectedLotsFromTrips = (isInSelected) => {
  const filterSelectedTrips = filter(compose(isInSelected, getTripId));
  return compose(flattenLots, filterSelectedTrips);
};
export const getUnselectedTrips = isInSelected => reject(compose(isInSelected, getTripId));

export const getSelectedTripNames = compose(keys, pickBy(equals(true)));
export const prepareParams = ({ params, dispatch_status }) => {
  const { search, sort_by, ...filters } = compose(
    when(prop('search'), pick(['search'])),
    reduce((acc, param) => merge(acc)(defaultTo(param[1])(param[0])), {}),
  )(params);
  return {
    skip_pagination: true,
    filter_by: {
      dispatch_status,
      ...filters,
    },
    ...(search ? { search } : {}),
    ...(sort_by ? { sort_by } : {}),
  };
};

export const countLots = compose(sum, map(compose(length, prop('lots'))));

const gethasLotWithIssue = compose(
  not,
  equals(undefined),
  find(propEq('active_issue_flag', 'Yes')),
);
const isDistributableTrip = (trip) => {
  const itemNotDistributable = !trip.distributable;
  const isAssignedAsDriver = trip.vendor_personnel_id !== null;
  const hasActiveIssue = trip.rejection_reason !== null && trip.override_reason === null;
  return !(
    itemNotDistributable ||
    isAssignedAsDriver ||
    hasActiveIssue ||
    gethasLotWithIssue(trip.lots)
  );
};
export const hasDistributableTrips = trips => any(isDistributableTrip)(trips);
