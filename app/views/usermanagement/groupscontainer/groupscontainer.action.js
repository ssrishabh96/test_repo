import { map, compose, pick, head, values, filter } from 'ramda';
import {
  GET_GROUPS_LIST_INIT,
  GET_GROUPS_LIST_FULFILLED,
  GET_GROUPS_LIST_ERROR,
} from './groupscontainer.constants';

import * as usermanagementService from '../usermanagement.service';
import { getActiveVendor, getAllGroups, getUserRole } from 'views/login/login.redux';
import { GROUP_MANAGER } from 'constants/user/roles';

export const getGroupsInit = () => ({
  type: GET_GROUPS_LIST_INIT,
});

export const getGroupsSuccess = data => ({
  type: GET_GROUPS_LIST_FULFILLED,
  data,
});

export const getGroupsError = error => ({
  type: GET_GROUPS_LIST_ERROR,
  error,
});

export const getGroups = () => (dispatch, getState) => {
  dispatch(getGroupsInit());
  const userRole = getUserRole(getState());
  const allGroupsByActiveVendor = getAllGroups(getState());
  const pickGroupIds = pick(['dispatch_group_id']);
  const groupIdsByActiveVendor = map(compose(head, values, pickGroupIds))(allGroupsByActiveVendor);
  const filterByActiveVendorGroupId = group =>
    groupIdsByActiveVendor.includes(group.dispatchGroupId);

  const vendorId = getActiveVendor(getState());
  return usermanagementService
    .getGroups(vendorId)
    .then(({ data }) => {
      if (data) {
        const activeUserGroups =
          parseInt(userRole, 10) === GROUP_MANAGER
            ? filter(filterByActiveVendorGroupId)(data)
            : data;
        dispatch(getGroupsSuccess(activeUserGroups));
      } else {
        const error = {
          message: 'Error loading groups list',
        };
        dispatch(getGroupsError(error));
      }
    })
    .catch(error => dispatch(getGroupsError(error)));
};
