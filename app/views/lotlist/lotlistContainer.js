import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { pathOr } from 'ramda';
import LotList from './lotlist.view';
import { lotListSelector } from './lotlist.redux';
import { getCacheForCurrentUser } from 'views/pickupform/pickupform.redux';

import {
  // fetchData,
  setCurrentLotList,
  setMultiselectMode,
  resetMultiselectMode,
  toggleSelection,
  // clearSelection,
  checkInLots,
  showSearch,
  resetSearch,
  hideSearch,
  resetAllFilters,
  setSearchQuery,
  acknowledgeTrip,
  getInProgressLotList,
  setSelectedFilters,
  getInTransitLotList,
  getCompletedLotList,
  handleSortChangeForLotList,
  toggleSortVisibility,
  toggleFilterVisibility,
} from './lotlist.action';

const mapDispatchToProps = {
  // fetchData,
  setCurrentLotList,
  toggleSelection,
  // clearSelection,
  setMultiselectMode,
  resetMultiselectMode,
  checkInLots,
  showSearch,
  resetSearch,
  hideSearch,
  resetAllFilters,
  setSearchQuery,
  acknowledgeTrip,
  getInProgressLotList,
  setSelectedFilters,
  getInTransitLotList,
  getCompletedLotList,
  handleSortChangeForLotList,
  toggleSortVisibility,
  toggleFilterVisibility,
};

export const withLazySelectors = (type = 'lotList', getValue) => {
  const pathSelector = createStructuredSelector({
    type: () => type,
    lotList: getValue,
    inProgressCache: getCacheForCurrentUser,
  });

  const selector = createSelector(pathSelector, lotListSelector, (path, lotlist) => ({
    ...lotlist,
    ...path,
  }));

  return connect(selector, mapDispatchToProps)(LotList);
};

export const LotListView = connect(lotListSelector, mapDispatchToProps)(LotList);
