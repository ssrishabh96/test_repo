// @flow

const navProps = {
  index: 0,
  routes: [{ key: '1', icon: 'company', count: 0 }, { key: '2', icon: 'driver', count: 0 }],
};

export type Props = {
  groupIsLoading: boolean,
  driverIsLoading: boolean,
  onDriverItemPress: () => void,
  onGroupItemPress: () => void,
  onTabIndexChanged: () => void,
  driversList: Array<Object>,
  groupData: Array<Object>,
  props: any,
  navProps: typeof navProps,
};

export type DriverDetailViewProps = {
  driverIsLoading: boolean,
  driverId: number,
  driverData: Array<Object>,
  driver: Object,
  currentDriver: Object,
  navigator: Object,
  updateDriverStatus: (driverId: number, navigator: Object) => void,
  updateDriverDispatchableFlag: (driverId: number, navigator: Object) => void,
  setCurrentDriver: (driver: Object) => void,
  pcardAction: (driverId: number, action: string, navigator: Object) => void,
};
