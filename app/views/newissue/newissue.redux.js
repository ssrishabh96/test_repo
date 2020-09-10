import { pathOr, sortBy, prop } from 'ramda';
import { createStructuredSelector } from 'reselect';
import {
  initialState,
  FETCH_ISSUE_REASONS_INIT,
  FETCH_ISSUE_REASONS_SUCCESS,
  FETCH_ISSUE_REASONS_FAILURE,
} from './newissue.constants';

const sortByDescription = sortBy(prop('description'));

export const raiseIssueReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ISSUE_REASONS_INIT:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_ISSUE_REASONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: sortByDescription(action.data),
      };
    case FETCH_ISSUE_REASONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

const getIsLoading = pathOr(false, ['raiseIssueReasons', 'isLoading']);
const getError = pathOr(null, ['raiseIssueReasons', 'error']);
const getData = pathOr([], ['raiseIssueReasons', 'data']);

export const raiseIssueSelector = createStructuredSelector({
  isLoading: getIsLoading,
  error: getError,
  issueReasons: getData,
});
