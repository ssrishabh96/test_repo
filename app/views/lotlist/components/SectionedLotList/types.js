import { LotItemType } from '../LotItem/types';

export type LotListSectionItem = {
  key: String,
  data: Array<LotItemType>,
};

export type Props = {
  onSelect: (number, LotItemType) => void,
  data: Array<LotListSectionItem>,
};
