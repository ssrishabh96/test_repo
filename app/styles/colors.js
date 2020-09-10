import { LOT_STATUSES } from 'constants/Lot';

export default {
  COPART_BLUE: '#005abc',
  LIGHT_BLUE: 'rgb(75,145,222)',
  WHITE: '#ffffff',
  OFF_WHITE: '#f7f7f7',
  GRAY_LIGHT: '#DBE2E5',
  TEXT_DARK: '#5B6068',
  TEXT_LIGHT: '#3266ba',
  SECTION_HEADER_BG: '#2C303A',
  GRAY_DARK: 'rgb(84, 90, 99)',
  GRAY_DARK_TRANPARENT: 'rgba(84, 90, 99, 0.5)',
  GRAY_DARK_1: '#323742',
  GRAY_1: '#3f444c',
  GRAY_2: 'rgb(216, 216, 216)',
  LIGHT_GREEN: 'rgb(146, 208, 78)',
  DARK_GREEN: 'rgb(105, 184, 84)',
  LIGHT_YELLOW: 'rgb(248, 231, 28)',
  LIGHT_RED: '#ffe3e3',
  DARK_RED: 'rgb(232, 73, 70)',
  DARK_YELLOW: 'rgb(255, 193, 7)',
  GAINSBORO: '#DCDCDC',
  DISABLED: '#a2a8b2',
};

export const badgeColors = {
  assignedTrips: 'rgb(75,145,222)',
  acceptedTrips: 'rgb(33,94,183)',
  inProgress: 'rgb(241,166,54)',
  inTransit: 'rgb(224,100,30)',
  completed: 'rgb(105, 184, 84)',
};

export const badgeColorsByStatus = {
  [LOT_STATUSES.AWAITING_VENDOR_ACKNOWLEDGEMENT]: 'rgb(75,145,222)',
  [LOT_STATUSES.AWAITING_GROUP_ACKNOWLEDGEMENT]: 'rgb(75,145,222)',
  [LOT_STATUSES.AWAITING_DRIVER_ACKNOWLEDGEMENT]: 'rgb(75,145,222)',
  [LOT_STATUSES.AWAITING_IN_PROGRESS]: 'rgb(33,94,183)',
  [LOT_STATUSES.AWAITING_FORM_SUBMISSION]: 'rgb(241,166,54)',
  [LOT_STATUSES.AWAITING_ARRIVAL]: 'rgb(224,100,30)',
  [LOT_STATUSES.AWAITING_CHECKIN]: 'rgb(105, 184, 84)',
  [LOT_STATUSES.AWAITING_TRIP_VERIFICATION]: 'rgb(105, 184, 84)',
  [LOT_STATUSES.COMPLETED]: 'rgb(105, 184, 84)',
  resolved: 'rgb(105, 184, 84)',
  partialTripConfirmed: 'rgb(187,137,54)',
};
