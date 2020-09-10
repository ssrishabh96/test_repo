import colors from 'styles/colors';

export const issueResolutionMap = {
  remove_driver: {
    title: 'issuesQueue.issueDetail.resolutionBtn.removeDriver',
    btnColor: colors.DARK_RED,
    icon: null, // TODO: add icon if needed here
  },
  change_driver: {
    title: 'issuesQueue.issueDetail.resolutionBtn.changeDriver',
    btnColor: colors.COPART_BLUE,
    icon: null,
  },
  override: {
    title: 'issuesQueue.issueDetail.resolutionBtn.override',
    btnColor: colors.LIGHT_GREEN,
    icon: null,
  },
  remove_from_trip: {
    title: 'issuesQueue.issueDetail.resolutionBtn.removeFromTrip',
    btnColor: colors.DARK_YELLOW,
    icon: null,
  },
  unclear_for_pickup: {
    title: 'issuesQueue.issueDetail.resolutionBtn.unclearForPickup',
    btnColor: colors.DARK_YELLOW,
    icon: null,
  },
  seller_approval: {
    title: 'issuesQueue.issueDetail.resolutionBtn.sellerApproval',
    btnColor: colors.COPART_BLUE,
    icon: null,
  },
  cant_clear: {
    title: 'issuesQueue.issueDetail.resolutionBtn.cannotClear',
    btnColor: colors.DARK_RED,
    icon: null,
  },
  trip_maintenance: {
    title: 'issuesQueue.issueDetail.resolutionBtn.changeDriverOrGroup',
    btnColor: colors.DARK_YELLOW,
    icon: null,
  },
};
