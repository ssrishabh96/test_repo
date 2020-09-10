import { images } from 'constants/icons';
import Locale from 'utils/locale';

export default {
  acceptedTrips: {
    image: images.acceptedPlaceholder,
    title: Locale.translate('tab.Acknowledged.emptyTitle'),
    subtitle: Locale.translate('tab.Acknowledged.emptySubTitle'),
  },
  assignedTrips: {
    image: images.assignedPlaceholder,
    title: Locale.translate('tab.Assigned.emptyTitle'),
    subtitle: Locale.translate('tab.Assigned.emptySubTitle'),
  },
  inProgress: {
    image: images.inProgressPlaceholder,
    title: Locale.translate('tab.inProgress.emptyTitle'),
    subtitle: Locale.translate('tab.inProgress.emptySubTitle'),
  },
  inTransit: {
    image: images.inTransitPlaceholder,
    title: Locale.translate('tab.inTransit.emptyTitle'),
    subtitle: Locale.translate('tab.inTransit.emptySubTitle'),
  },
  completedLots: {
    image: images.completedPlaceholder,
    title: Locale.translate('tab.completedLots.emptyTitle'),
    subtitle: Locale.translate('tab.completedLots.emptySubTitle'),
  },
  issueLots: {
    image: images.issuesPlaceholder,
    title: Locale.translate('tab.issueLots.emptyTitle'),
    subtitle: Locale.translate('tab.issueLots.emptySubTitle'),
  },
  assignedIssueLots: {
    image: images.issuesPlaceholder,
    title: Locale.translate('tab.assignedIssueLots.emptyTitle'),
    subtitle: Locale.translate('tab.assignedIssueLots.emptySubTitle'),
  },
  declinedTrips: {
    image: images.declinedPlaceholder,
    title: Locale.translate('tab.declinedTrips.emptyTitle'),
    subtitle: Locale.translate('tab.declinedTrips.emptySubTitle'),
  },
  assignedDeclinedTrips: {
    image: images.declinedPlaceholder,
    title: Locale.translate('tab.assignedDeclinedTrips.emptyTitle'),
    subtitle: Locale.translate('tab.assignedDeclinedTrips.emptySubTitle'),
  },
  offline: {
    image: images.offlinePlaceholder,
    title: 'You are offline',
    subtitle: 'Disconnected from the internet',
  },
  distributedTrips: {
    image: images.distributedPlaceholder,
    title: Locale.translate('tab.distributedTrips.emptyTitle'),
    subtitle: Locale.translate('tab.distributedTrips.emptySubTitle'),
  },
  distributedLots: {
    image: images.distributedPlaceholder,
    title: Locale.translate('tab.distributedLots.emptyTitle'),
    subtitle: Locale.translate('tab.distributedLots.emptySubTitle'),
  },
  globalSearch: {
    image: '',
    title: 'No lots found',
    subtitle: '',
  },
  defaultType: {
    image: '',
    title: Locale.translate('tab.loading.title'),
    subtitle: '',
  },
};
