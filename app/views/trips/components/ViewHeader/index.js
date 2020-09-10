import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import renderIf from 'render-if';

import { getSelectedTripNames } from '../../helpers/tripHelpers';

import ListHeader from 'components/custom/List/ListHeader';
import IconButton from 'components/core/Button/IconButton';
import icons from 'constants/icons';
import colors from 'styles/colors';
import locale from 'utils/locale';

const defaultProps = {
  count: 0,
  showMultiselect: true,
  // multiselectActive: false, // defined but never used
};

const propTypes = {
  tripcount: PropTypes.number,
  lotcount: PropTypes.number,
  showMultiselect: PropTypes.bool,
  multiselect: PropTypes.object,
  selected: PropTypes.object,
  onCancel: PropTypes.func,
  toggleAckMode: PropTypes.func,
  showFilters: PropTypes.func,
  filterCount: PropTypes.number,
  toggleModal: PropTypes.func,
};

const CancelButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={{ fontSize: 18, color: colors.LIGHT_YELLOW }}>{locale.translate('Cancel')}</Text>
  </TouchableOpacity>
);
CancelButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

const getCount = (multiselect, tripcount, lotcount, selectedItems = {}) =>
  multiselect.active
    ? `${getSelectedTripNames(selectedItems).length} / ${tripcount} Trips Selected`
    : `${tripcount} Trips | ${lotcount} Lots`;

const multiselectActionMap = {
  response: 'Select Trips to Send Response',
  distribute: 'Select Trips to Distribute',
};

class TripsListHeader extends Component {
  static defaultProps = defaultProps;
  static propTypes = propTypes;
  render() {
    const {
      showMultiselect,
      tripcount,
      lotcount,
      selected: selectedItems,
      multiselect,
      onCancel,
      toggleModal,
    } = this.props;
    const renderIfFilterCountNotZero = renderIf(this.props.filterCount !== 0);

    const actions = [
      showMultiselect ? (
        <IconButton
          icon={icons.tripsScreen.tripIconCheckbox}
          style={
            {
              // marginRight: 20,
            }
          }
          onPress={this.props.toggleAckMode}
        />
      ) : null,
      <IconButton
        icon={icons.tripsScreen.tripIconSort}
        styles={{
          // marginRight: 20,
          width: 19,
          height: 21,
        }}
        onPress={toggleModal}
      />,
      <IconButton
        icon={icons.tripsScreen.tripIconFilter}
        styles={{
          // marginRight: 20,
          width: 21,
          height: 18,
          tintColor: this.props.filterCount !== 0 ? colors.LIGHT_YELLOW : null,
        }}
        onPress={this.props.showFilters}
      />,
      renderIfFilterCountNotZero(
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 3,
            backgroundColor: colors.LIGHT_YELLOW,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'transparent',
          }}
        >
          <Text style={{ backgroundColor: colors.LIGHT_YELLOW, borderRadius: 5 }}>
            {this.props.filterCount}
          </Text>
        </View>,
      ),
    ].filter(item => item);

    return (
      <ListHeader
        title={multiselect.active ? multiselectActionMap[multiselect.type] : ''}
        subtitle={getCount(multiselect, tripcount, lotcount, selectedItems)}
        actions={multiselect.active ? [<CancelButton onPress={onCancel} />] : actions}
      />
    );
  }
}

export default TripsListHeader;
