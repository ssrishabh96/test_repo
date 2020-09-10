import {
  compose,
  head,
  prop,
  map,
  without,
  keys,
  values,
  reduce,
  reject,
  isEmpty,
  filter,
  equals,
  identity,
  forEachObjIndexed,
  mapObjIndexed,
  add,
} from 'ramda';
import moment from 'moment';
import { renameKeys } from 'utils/commonUtils';
import { bucketToStatusMap } from 'constants/Lot';
import * as tripsService from 'views/trips/trips.service';

export const getInitialField = compose(prop('field'), head);
export const getInitialValues = compose(prop('values'), head);

export const prepareInitialSelected = (selected, available) =>
  mapObjIndexed((i, k) =>
    reduce(
      (acc, val) => {
        if (available[k].indexOf(val) !== -1) {
          acc[val] = true;
          acc.count += 1;
        }
        return acc;
      },
      { count: 0 },
    )(i),
  )(selected);

export const prepareFinalSelected = compose(
  reject(isEmpty),
  map(compose(compose(without(['count']), keys), filter(equals(true)))),
);

const formatDate = date => moment(date).format('MM/DD/YYYY');
const formatPayment = payment => payment || 'Unknown';

export const categoryMap = {
  location_city: { label: 'City', getKeys: identity },
  location_zip: { label: 'Zip', getKeys: identity },
  trip_type_code: { label: 'Trip Type', getKeys: identity },
  vendor_name: { label: 'Tow Provider', getKeys: identity },
  is_residence: { label: 'Residence', getKeys: identity },
  is_towable: { label: 'Towable', getKeys: identity },
  loss_type_code: { label: 'Loss Type', getKeys: identity },
  lot_make: { label: 'Make', getKeys: identity },
  promised_date: { label: 'Promised Date', getKeys: formatDate },
  is_scheduled: { label: 'Scheduled', getKeys: identity },
  lot_stage_desc: { label: 'Lot Stage', getKeys: identity }, // ?
  tow_type_code: { label: 'Tow Type', getKeys: identity },
  active_issue_flag: { label: 'Has Active Issue', getKeys: identity },
  is_due_today: { label: 'Due Today', getKeys: identity },
  payment_mode: { label: 'Payment Mode', getKeys: formatPayment },
  lot_model_year: { label: 'Model Year', getKeys: identity },
  location_name: { label: 'Location Name', getKeys: identity },
  sublot_name: { label: 'Sublot Name', getKeys: identity },
  damage_type_code: { label: 'Damage Type', getKeys: identity }, // ?
};

const keymap = {
  residence_flag: 'is_residence',
  towable_flag: 'is_towable',
  scheduled_flag: 'is_scheduled',
  due_today_flag: 'is_due_today',
  vendor_personnel_full_name: 'vendor_name',
  issues: 'active_issue_flag',
};

export const getAvailableFilters = (bucket) => {
  const params = {
    filter_by: {
      dispatch_status: bucketToStatusMap[bucket],
    },
  };
  return tripsService
    .getFacetCount(params)
    .then(({ data }) => Promise.resolve(renameKeys(keymap, data)));
};

const prepareValues = (key, arr) => {
  const values = [];
  for (let i = 0; i < arr.length; i += 2) {
    values.push({
      code: arr[i],
      description: categoryMap[key].getKeys(arr[i]),
      count: arr[i + 1],
    });
  }
  return values;
};
export const prepareData = (data) => {
  const arr = [];
  forEachObjIndexed((val, key) => {
    if (categoryMap[key] && val.length > 0) {
      arr.push({
        field: categoryMap[key].filter || key,
        label: categoryMap[key].label,
        values: prepareValues(key, val) || val,
      });
    }
  }, data);
  return arr;
};

export const getSelectedCount = compose(reduce(add, 0), map(prop('count')), values);
