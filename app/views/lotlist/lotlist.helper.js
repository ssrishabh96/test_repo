// @flow

import {
  keys,
  pickBy,
  equals,
  compose,
  when,
  prop,
  pick,
  reduce,
  merge,
  defaultTo,
  identity,
  ascend,
  descend,
  isEmpty,
  head,
  toPairs,
  sort,
  path,
  mapObjIndexed,
  contains,
  filter,
  allPass,
  values,
} from 'ramda';
import moment from 'moment';
import { bucketToStatusMap } from 'constants/Lot';

export const getSelectedLotNames = compose(keys, pickBy(equals(true)));

export const bucketMap = {
  inProgress: 'inProgress',
  inTransit: 'inTransit',
  acceptedTrips: 'lotList',
  assignedTrips: 'lotList',
  completed: 'completed',
  distributed: 'distributed',
  globalSearch: 'globalSearch',
};

export const prepareParams = ({ params, dispatch_status, otherFilterParams }) => {
  const { search, sort_by, ...filters } = compose(
    when(prop('search'), pick(['search'])),
    reduce((acc, param) => merge(acc)(defaultTo(param[1])(param[0])), {}),
  )(params);
  return {
    skip_pagination: true,
    filter_by: {
      dispatch_status,
      ...filters,
      ...otherFilterParams,
    },
    ...(search ? { search } : {}),
    ...(sort_by ? { sort_by } : {}),
  };
};

const getStatusForBucket = (bucket) => {
  if (bucket === 'distributed' || bucket === 'globalSearch') return {};
  return { dispatch_status: bucketToStatusMap[bucket] };
};
const getOtherFilterParamsByBucket = (bucket) => {
  if (bucket === 'completed') {
    return {
      completed_date: {
        gte: moment()
          .subtract(7, 'days')
          .format('YYYY-MM-DD'),
        lte: moment()
          .add(1, 'days')
          .format('YYYY-MM-DD'),
      },
      status: ['I', 'A'],
    };
  }
  return {};
};
const otherParamsByBucket = (bucket) => {
  if (bucket === 'distributed') {
    return {
      // skip_pagination: true,
      view: 'oversight',
    };
  }
  if (bucket === 'completed') {
    return { skip_pagination: true };
  }
  return {};
};

type prepareParamsParams = {
  bucket:
    | 'inProgress'
    | 'inTransit'
    | 'completed'
    | 'distributed'
    | 'assigned'
    | 'accepted'
    | 'globalSearch',
  filter: { [string]: string[] },
  sort: { sort_by?: { [string]: 'asc' | 'desc' } },
  search: { search?: string },
};
type returnType = {
  filter_by?: {
    dispatch_status?: number | number[],
    [string]: any, // ...getOtherFilterParamsByBucket() & ...filters
  },
  search?: string,
  sort_by?: { [string]: 'asc' | 'desc' },
  [string]: any, // ...otherParamsByBucket()
};
export const prepareParams2 = ({
  bucket,
  sort,
  search,
  filter,
}: prepareParamsParams): returnType => {
  const status = getStatusForBucket(bucket);
  const otherFilterParams = getOtherFilterParamsByBucket(bucket);
  const filter_by = { ...status, ...(isEmpty(search) ? filter : {}), ...otherFilterParams };
  const result = {
    ...(!isEmpty(filter_by) ? { filter_by } : {}),
    ...search,
    ...(isEmpty(search) ? sort : {}),
    ...otherParamsByBucket(bucket),
  };
  return result;
};

export const defaultToState = (given, state) => defaultTo(state)(given);

export const searchByLotNumber = query =>
  filter(item => item.number.toString().indexOf(query) === 0);

const sortMap = {
  promised_date: compose(t => new moment(t), prop('promisedTripDate')),
  is_towable: prop('isTowable'),
  lot_number: prop('number'),
};
export const sortLotList = (sort_by) => {
  if (isEmpty(sort_by)) return identity;
  const [field, direction] = head(toPairs(sort_by));
  return direction === 'asc' ? sort(ascend(sortMap[field])) : sort(descend(sortMap[field]));
};

const filterMap = {
  payment_mode: prop('paymentMode'),
  active_issue_flag: prop('active_issue_flag'),
  damage_type_code: prop('damageCode'),
  is_towable: prop('isTowable'),
  location_city: path(['source', 'city']),
  trip_type_code: prop('tripType'),
};
export const filterLotList = (filters) => {
  if (isEmpty(filters)) return identity;
  const newfilters = mapObjIndexed((keys, filt) => obj => contains(filterMap[filt](obj), keys))(
    filters,
  );
  return filter(allPass(values(newfilters)));
};
