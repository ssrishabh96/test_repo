import { LotItemType } from '../LotItem/types';

export type Props = {
  lots: ?Array<LotItemType>,
};

type initialRegionType = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
};
export type State = {
  initialRegion: initialRegionType,
};

export type MarkerType = {
  number: number,
  description: string,
  coordinate: {
    latitude: number,
    longitude: number,
  },
};
