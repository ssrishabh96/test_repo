import { LotItemType } from '../LotItem/types';

type ViewHeaderProps = {
  count: ?number,
  lots: ?Array<LotItemType>,
  navigator: ?Object,
  multiselect: ?Object,
  selectedItems: ?Object,
  onCancel: Function,
  toggleAckMode: Function,
  handleOpenFilters: Function,
  filterCount: number,
  toggleModal: Function,
  handleSyncAll: ?Function,
  connectionStatus: true | false,
  awaitingSyncCount: ?number,
};
export type ViewHeaderPropTypes = ViewHeaderProps;
