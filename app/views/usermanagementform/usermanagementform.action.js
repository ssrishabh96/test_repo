import {
  FETCH_COUNTRIES_LIST,
  FETCH_STATES_LIST,
} from './usermanagementform.constants';

import countriesList from './__mock__/countryList';
import statesList from './__mock__/stateList';

export const fetchCountriesList = () => ({
  type: FETCH_COUNTRIES_LIST,
  data: countriesList,
});

export const fetchStatesList = () => ({
  type: FETCH_STATES_LIST,
  data: statesList,
});
