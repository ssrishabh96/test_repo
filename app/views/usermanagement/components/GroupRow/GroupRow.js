import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import Row from 'components/custom/List/ListRow';
import GroupRowInfoItem from './GroupRowInfoItem';

import styles from './styles';
import colors from 'styles/colors';
import locale from 'utils/locale';

class GroupRow extends Component {
  static propTypes = {
    group: PropTypes.object.isRequired, // eslint-disable-line
    onPressItem: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    chevron: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    chevron: true,
  };

  statusMapper = {
    I: 'INACTIVE',
    A: 'ACTIVE',
  };

  render() {
    // FIXME: contactName missing in mock data.
    // FIXME: phoneNum is also missing
    // UPDATE: These fields are not available in the TSM response too. Should we remove this?
    const {
      group: { name, dispatchGroupId, description, status, dispatchableFlag },
      disabled = false,
      chevron = true,
      onPressItem,
    } = this.props;
    return (
      <Row
        chevron={chevron !== false}
        bottomBorder
        containerStyle={
          disabled
            ? [styles.containerStyle, { backgroundColor: colors.GRAY_LIGHT }]
            : styles.containerStyle
        }
        bottomBorderStyle={styles.bottomBorderStyle}
      >
        <TouchableOpacity
          onPress={() => !disabled && onPressItem && onPressItem(dispatchGroupId)}
          disabled={!onPressItem || disabled}
        >
          <GroupRowInfoItem
            isHeader
            headerTitle={name.toUpperCase() || locale.translate('N/A')}
          />
          <GroupRowInfoItem
            label="Name"
            value={description || locale.translate('N/A')}
          />
          <View style={{ flexDirection: 'row' }}>
            <GroupRowInfoItem
              styles={{ marginRight: 30 }}
              label="Status"
              value={this.statusMapper[status]}
            />
            <GroupRowInfoItem
              label="Dispatchable"
              value={
                dispatchableFlag
                  ? locale.translate('Yes').toUpperCase()
                  : locale.translate('No').toUpperCase()
              }
            />
          </View>
          <GroupRowInfoItem
            label="Email"
            value={locale.translate('N/A')}
          />
          <GroupRowInfoItem label="Phone">
            <TouchableOpacity onPress={() => {}}>
              <Text style={{ fontSize: 16, color: colors.GRAY_DARK }}>
                {locale.translate('N/A')}
              </Text>
            </TouchableOpacity>
          </GroupRowInfoItem>
        </TouchableOpacity>
      </Row>
    );
  }
}

export default GroupRow;
