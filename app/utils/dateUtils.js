import moment from 'moment';

export const getFormattedDate = t => new moment(t).format('L');
