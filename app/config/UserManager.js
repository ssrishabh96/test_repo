// import { Platform } from 'react-native';
import icons from 'constants/icons';
// import colors from 'styles/colors';

let USER_ROLE = 0;

export const updateUserRole = role => (USER_ROLE = role);

const navBarRightButtons = [
  {
    id: 'search',
    icon: icons.tripsScreen.tripIconSearch,
    role: 3,
  },
  {
    id: 'distribute',
    icon: icons.tripsScreen.tripIconDistribute,
    role: 2, // should be atleast this role
  },
];

export const getNavBarRightButtonsForUser = (role = USER_ROLE) =>
  navBarRightButtons.filter(button => role <= button.role).map(btn => ({ ...btn }));

export const getNavBarRightButtons = (notDistributable, data) => {
  let navbarButtons = getNavBarRightButtonsForUser(); // Buttons according to user role
  if (notDistributable || data.length === 0) {
    navbarButtons = navbarButtons.map((btnObj) => {
      if (btnObj.id === 'distribute') {
        return {
          ...btnObj,
          disabled: true,
        };
      }
      return btnObj;
    });
  }
  return navbarButtons;
};

export const getHomeGridDataForUser = (homeGridData, role = USER_ROLE) =>
  homeGridData.map(row =>
    row
      .map((rowItem) => {
        if (!rowItem) {
          return null;
        }
        if (typeof rowItem.getItem === 'function') {
          return rowItem.getItem(role);
        }
        return role <= rowItem.role ? rowItem : null;
      })
      .filter(item => item),
  );
