import { find, propEq, filter } from 'ramda';
import {
  REQUEST_DRIVERS_LIST_INIT,
  REQUEST_DRIVERS_LIST_SUCCESS,
  // REQUEST_DRIVERS_LIST_FAILURE,
  REQUEST_GROUPS_LIST_INIT,
  REQUEST_GROUPS_LIST_SUCCESS,
  // REQUEST_GROUPS_LIST_FAILURE,
  FETCH_GROUPS_AND_DRIVERS_SUCCESS,
} from './assigntolist.constants';

import { getActiveVendor, getUserRole } from 'views/login/login.redux';
import * as usermanagementService from 'views/usermanagement/usermanagement.service';
import { GROUP_MANAGER } from 'constants/user/roles';

const filterDriversByGroup = (drivers, groups, groupID) => {
  const group = find(propEq('dispatchGroupId', groupID))(groups);
  if (!group) return drivers; // ?
  return filter(
    driver => !!find(propEq('vendor_personnel_id', driver.vendorPersonnelId))(group.personnel),
  )(drivers);
};

export const fetchDriversListSuccess = () => (dispatch, getState) => {
  const vendorId = getActiveVendor(getState());
  return usermanagementService.getPersonnel(vendorId).then(({ data }) => {
    dispatch({
      type: REQUEST_DRIVERS_LIST_SUCCESS,
      data,
    });
    return data;
  });
};

export const fetchGroupsListSuccess = () => (dispatch, getState) => {
  const vendorId = getActiveVendor(getState());
  return usermanagementService.getGroups(vendorId).then(({ data }) => {
    dispatch({
      type: REQUEST_GROUPS_LIST_SUCCESS,
      data,
    });
    return data;
  });
};

export const fetchData = group => (dispatch, getState) => {
  // TODO: Do not fetch groups list if current user role === GM
  dispatch({
    type: REQUEST_DRIVERS_LIST_INIT,
  });
  dispatch({
    type: REQUEST_GROUPS_LIST_INIT,
  });
  setTimeout(() => {
    Promise.all([dispatch(fetchDriversListSuccess()), dispatch(fetchGroupsListSuccess())]).then(
      ([drivers, groups]) => {
        const role = getUserRole(getState());
        if (role === GROUP_MANAGER && !!group) {
          const filteredDrivers = filterDriversByGroup(drivers, groups, group);
          dispatch({
            type: REQUEST_DRIVERS_LIST_SUCCESS, // should rename?
            data: filteredDrivers,
          });
        }
        dispatch({ type: FETCH_GROUPS_AND_DRIVERS_SUCCESS });
      },
    );
  }, 500);
};
