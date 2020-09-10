// @flow

import type { Props } from './types';

import React from 'react';
import { TouchableOpacity } from 'react-native';

import Row from 'components/custom/List/ListRow';
import DriverInfoItem from './DriverInfoItem';
import PcardItem from '../PcardItem';

import styles from './styles';
import colors from 'styles/colors';

class DriverRow extends React.Component<Props> {
  statusMapper = {
    I: 'INACTIVE',
    A: 'ACTIVE',
  };

  render() {
    const {
      driver: {
        vendorPersonnelId,
        firstName,
        lastName,
        middleName,
        email,
        status,
        pcard,
        dispatchableFlag,
        role,
      },
      showRole = false,
      disabled = false,
      chevron,
      onPressItem,
    } = this.props;

    const title = `${firstName || 'N/A'} ${lastName || 'N/A'}`;

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
          onPress={() => !disabled && onPressItem && onPressItem(vendorPersonnelId)}
          disabled={!onPressItem || disabled}
        >
          <DriverInfoItem
            isHeader
            headerTitle={title}
          />
          <DriverInfoItem
            label={'Status'}
            value={this.statusMapper[status]}
          />
          <DriverInfoItem
            label={'Dispatchable'}
            value={dispatchableFlag ? 'YES' : 'NO'}
          />
          <DriverInfoItem
            label={'PCard'}
            pcard={<PcardItem pcard={pcard} />}
          />
          <DriverInfoItem
            label={'Email'}
            value={email}
          />
          {showRole && (
            <DriverInfoItem
              label={'Role'}
              value={role.split('_').join(' ')}
              styles={{ backgroundColor: colors.DARK_YELLOW, padding: 4, borderRadius: 10 }}
            />
          )}
        </TouchableOpacity>
      </Row>
    );
  }
}

export default DriverRow;
