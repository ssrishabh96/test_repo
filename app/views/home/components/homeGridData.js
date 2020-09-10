import icons from 'constants/icons';
import colors from 'styles/colors';
import Locale from 'utils/locale';

export const homeGridData = [
  [
    {
      id: 'assignedTrips',
      title: 'Assigned',
      icon: icons.homeScreen.homeIconAssigned,
      destinationScreen: 'CopartTransporter.AssignedRun',
      width: 'NO',
      tabIndex: 1,
      top: -8,
      right: 0,
      badgeColor: 'rgb(75,145,222)',
      localizedString: 'home.Assigned',
      role: 3,
    },
    {
      id: 'acceptedTrips',
      title: 'Acknowledged',
      icon: icons.homeScreen.homeIconAccepted,
      destinationScreen: 'CopartTransporter.AcknowledgedRun',
      width: 'Full',
      tabIndex: 2,
      top: -4,
      right: 12,
      badgeColor: 'rgb(33,94,183)',
      localizedString: 'home.Acknowledged',
      role: 3,
    },
    {
      id: 'inProgress',
      title: 'In Progress',
      icon: icons.homeScreen.homeIconInProgress,
      destinationScreen: 'CopartTransporter.InProgressRun',
      width: 'oneThird',
      tabIndex: 3,
      top: -3,
      right: 2,
      badgeColor: 'rgb(241,166,54)',
      localizedString: 'home.InProgress',
      role: 3,
    },
  ],
  [
    {
      id: 'inTransit',
      title: 'In Transit',
      icon: icons.homeScreen.homeIconInTransit,
      destinationScreen: 'CopartTransporter.AcknowledgedRun',
      width: 'oneThird',
      tabIndex: 4,
      top: -5,
      right: -9,
      badgeColor: 'rgb(224,100,30)',
      localizedString: 'home.InTransit',
      role: 3,
    },
    {
      id: 'completed',
      title: Locale.translate('home.Completed'),
      icon: icons.homeScreen.homeIconCompleted,
      destinationScreen: 'CopartTransporter.Completed',
      width: 'NO',
      top: -4,
      right: -4,
      badgeColor: 'rgb(99,180,36)',
      localizedString: 'home.Completed',
      role: 3,
    },
    {
      id: 'Distributed',
      title: Locale.translate('home.Distributed'),
      icon: icons.homeScreen.homeIconDistributed,
      destinationScreen: 'CopartTransporter.Distributed',
      width: 'NO',
      localizedString: 'home.Distributed',
      role: 2,
    },
  ],
  [
    {
      id: 'declinedtrips',
      title: Locale.translate('home.declinedTrips'),
      icon: icons.homeScreen.homeIconDeclineTrips,
      top: -5,
      right: 2,
      badgeColor: colors.DARK_RED,
      destinationScreen: 'CopartTransporter.DeclinedTripsView',
      width: 'NO',
      localizedString: 'home.declinedTrips',
      role: 3,
    },
    {
      getItem(role) {
        switch (role) {
          case 1:
          case 2:
            return {
              id: 'userManagement',
              title: Locale.translate('home.Users'),
              icon: icons.homeScreen.homeIconUsers,
              destinationScreen: 'CopartTransporter.UserManagement',
              width: 'NO',
              localizedString: 'home.Users',
              role: 2,
            };
          case 3:
            return {
              id: 'Profile',
              title: Locale.translate('home.DriverProfile'),
              icon: icons.homeScreen.homeIconDriverProfile,
              destinationScreen: 'CopartTransporter.DriverProfile',
              width: 'NO',
              localizedString: 'home.Profile',
              role: 3,
            };
          default:
            return {
              id: 'Profile',
              title: Locale.translate('home.DriverProfile'),
              icon: icons.homeScreen.homeIconDriverProfile,
              destinationScreen: 'CopartTransporter.DriverProfile',
              width: 'NO',
              localizedString: 'home.Profile',
              role: 3,
            };
        }
      },
    },
    {
      id: 'issues',
      title: 'Issues',
      icon: icons.homeScreen.homeIconIssues,
      right: -18, // relevant value for 'right' according to icon shape
      top: -8, // relevant value for 'top' according to icon shape
      badgeColor: colors.DARK_RED,
      destinationScreen: 'CopartTransporter.IssuesQueue',
      width: 'NO',
      localizedString: 'home.Issues',
      role: 3,
    },
  ],
];
