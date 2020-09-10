// @flow

import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import renderIf from 'render-if';

import { getSelectedLotNames } from '../../lotlist.helper';

import Locale from 'utils/locale';
import ListHeader from 'components/custom/List/ListHeader';
import IconButton from 'components/core/Button/IconButton';
import icons from 'constants/icons';
import colors from 'styles/colors';

import { ViewHeaderPropTypes } from './types';

const defaultProps = {
  title: '',
  subtitle: '',
  count: 0,
  showMultiselect: true,
  selectedItems: {},
  multiselect: {},
  awaitingSyncCount: 0,
};

const CancelButton = ({ onPress }: Object) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={{ fontSize: 18, color: colors.LIGHT_YELLOW }}>{Locale.translate('Cancel')}</Text>
  </TouchableOpacity>
);

const getCount = (
  multiselect: ViewHeaderPropTypes.multiselect,
  count: ViewHeaderPropTypes.count,
  selectedItems: ViewHeaderPropTypes.selectedItems,
) =>
  multiselect.active
    ? `${getSelectedLotNames(selectedItems).length} / ${count} ${Locale.translate(
      'lotList.header.lotsSelected',
    )}`
    : `${count} ${Locale.translate('lotList.Lots')}`;

const multiselectActionMap = {
  response: Locale.translate('lotList.actionMap.response'),
  distribute: Locale.translate('lotList.actionMap.distribute'),
};

export default class ViewHeader extends Component<ViewHeaderPropTypes> {
  static defaultProps = defaultProps;

  render() {
    const {
      title,
      count,
      onCancel,
      selectedItems,
      multiselect,
      listType,
      handleOpenFilters,
      filterCount,
      toggleSort,
      openMapView,
      handleSyncAll,
      connectionStatus,
      awaitingSyncCount,
    } = this.props;
    const renderIfFilterCountNotZero = renderIf(filterCount !== 0);
    const renderIfShouldShowSyncButton = renderIf(
      listType === 'inProgress' && connectionStatus && awaitingSyncCount > 0,
    );
    const actions =
      listType === 'completed'
        ? []
        : [
          renderIfShouldShowSyncButton(
            <IconButton
              icon={icons.tripsScreen.tripIconSort}
              styles={{
                width: 19,
                height: 21,
                tintColor: 'green',
              }}
              onPress={handleSyncAll}
            />,
          ),
          <IconButton
            icon={icons.tripsScreen.tripIconSort}
            styles={{
              width: 19,
              height: 21,
            }}
            onPress={toggleSort}
          />,
          <IconButton
            icon={icons.tripsScreen.tripIconFilter}
            styles={{
              width: 21,
              height: 18,
              tintColor: filterCount !== 0 ? colors.LIGHT_YELLOW : null,
            }}
            onPress={handleOpenFilters}
          />,
          renderIfFilterCountNotZero(
            <View
              style={{
                paddingHorizontal: 5,
                paddingVertical: 3,
                backgroundColor: colors.LIGHT_YELLOW,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: 'transparent',
              }}
            >
              <Text
                style={{ backgroundColor: colors.LIGHT_YELLOW, color: 'black', borderRadius: 5 }}
              >
                {filterCount}
              </Text>
            </View>,
          ),
          listType !== 'inTransit' ? (
            <IconButton
              icon={icons.tripsScreen.tripIconMap}
              onPress={openMapView}
            />
          ) : null,
        ];
    return (
      <ListHeader
        title={multiselect.active ? multiselectActionMap[multiselect.type] : title}
        subtitle={getCount(multiselect, count, selectedItems)}
        actions={multiselect.active ? <CancelButton onPress={onCancel} /> : actions}
      />
    );
  }
}
