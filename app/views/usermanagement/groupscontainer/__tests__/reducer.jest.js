import * as actions from '../groupscontainer.action';
import { initialState } from '../groupscontainer.constants';
import { groupsReducer } from '../groupscontainer.redux';

const groupData = [];
// TODO: create an expected structure of error object received
const error = {
  message: 'Foo Message',
};

describe('usermanagement::groupcontainer::reducer', () => {
  test('should toggle isLoading for getGroups list request', () => {
    expect(groupsReducer(initialState, actions.getGroupsInit())).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  test('should set error for getGroups list failed request', () => {
    expect(groupsReducer(initialState, actions.getGroupsError(error))).toEqual({
      ...initialState,
      isLoading: false,
      error,
    });
  });

  test('should set error for getGroups list success', () => {
    expect(groupsReducer(initialState, actions.getGroupsSuccess(groupData))).toEqual({
      isLoading: false,
      error: null,
      data: groupData,
    });
  });
});
