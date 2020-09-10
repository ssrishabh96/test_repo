// @flow

import type { Lot } from '../../../../types/Lot';

export type Props = {
  lot: Lot,
  comingFrom: 'raised' | 'assigned',
  navigator: Object,
  onReadResolvedIssue: Function,
  oResolveIssue: Function,
  onEscalate: Function,
};
