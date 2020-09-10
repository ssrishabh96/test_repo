import * as actions from '../groupscontainer.action';
import {
  GET_GROUPS_LIST_INIT,
  GET_GROUPS_LIST_FULFILLED,
  GET_GROUPS_LIST_ERROR,
} from '../groupscontainer.constants';

const error = {
  message: 'Foo Error',
};

describe('usermanagement::groupcontainer::action', () => {
  test('should create proper action for get groups isLoading state', () => {
    const expectedAction = {
      type: GET_GROUPS_LIST_INIT,
    };
    expect(actions.getGroupsInit()).toEqual(expectedAction);
  });
  test('should create proper action for get groups error state', () => {
    const expectedAction = {
      type: GET_GROUPS_LIST_ERROR,
      error,
    };
    expect(actions.getGroupsError(error)).toEqual(expectedAction);
  });
  test('should create proper action for get groups fulfilled state', () => {
    const expectedAction = {
      type: GET_GROUPS_LIST_FULFILLED,
      data: [],
    };
    expect(actions.getGroupsSuccess([])).toEqual(expectedAction);
  });
});
