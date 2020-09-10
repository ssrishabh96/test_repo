import { createStructuredSelector } from 'reselect';
import { pathOr } from 'ramda';

import {
  initialState,
  GET_GROUPS_LIST_INIT,
  GET_GROUPS_LIST_FULFILLED,
  GET_GROUPS_LIST_ERROR,
} from './groupscontainer.constants';

export const getGroupsList = pathOr([], ['userManagement', 'group', 'data']);
const getGroupIsLoading = pathOr(false, ['userManagement', 'group', 'isLoading']);
const getGroupError = pathOr(null, ['userManagement', 'group', 'error']);

export const groupsSelector = createStructuredSelector({
  groupData: getGroupsList,
  groupIsLoading: getGroupIsLoading,
  groupError: getGroupError,
});

export const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUPS_LIST_INIT:
      return {
        ...state,
        isLoading: true,
      };

    case GET_GROUPS_LIST_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    case GET_GROUPS_LIST_FULFILLED:
      return {
        data: action.data,
        error: null,
        isLoading: false,
      };

    default:
      return state;
  }
};
