import React from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, Image } from 'react-native';
import { prop, equals } from 'ramda';
import icons from 'constants/icons';
import IconButton from 'components/core/Button/IconButton';

import styles from './styles';
import Locale from 'utils/locale';

type Props = {
  +type: 'lotlist' | 'trip' | 'lotNotes',
  +isModalVisible: true | false,
  +selectedItem: (field: number) => any,
  +cancelSort: () => any,
  +selectedField: true | false,
  +hideClear?: true | false,
};

type ItemProps = {
  +item: Object,
  +selectedItem: () => any,
  +selectedField: string,
};
type HeaderProps = {
  +cancelSort: () => any,
  +selectedItem: () => any,
  +hideClear: true | false,
};
const sortOptions = {
  trip: [
    { value: 'Trip ID (high to low)', field: { trip_id: 'desc' } },
    { value: 'Trip ID (low to high)', field: { trip_id: 'asc' } },
    { value: 'Trip Date (latest to oldest)', field: { trip_date: 'desc' } },
    { value: 'Trip Date (oldest to latest)', field: { trip_date: 'asc' } },
  ],
  lotlist: [
    { value: 'Lot Number (high to low)', field: { lot_number: 'desc' } },
    { value: 'Lot Number (low to high)', field: { lot_number: 'asc' } },
    { value: 'Promised Date (latest to oldest)', field: { promised_date: 'desc' } },
    { value: 'Promised Date (oldest to latest)', field: { promised_date: 'asc' } },
    { value: 'Towable', field: { is_towable: 'desc' } },
  ],
  lotNotes: [
    { value: 'Date Ascending', field: 'asc' },
    { value: 'Date Descending', field: 'desc' },
  ],
};

const Header = ({ cancelSort, selectedItem, hideClear }: HeaderProps) => (
  <View style={styles.header}>
    <Text style={styles.title}>{Locale.translate('sort.title')}</Text>
    <View style={styles.buttonWrap}>
      {!hideClear && (
        <TouchableOpacity
          onPress={() => {
            selectedItem({});
          }}
        >
          <Text style={styles.button}>{Locale.translate('sort.buttons.clear')}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={cancelSort}>
        <Text style={styles.button}>{Locale.translate('Cancel')}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const RowSeparator = () => <View style={styles.rowSeparator} />;

const SortItem = ({ item, selectedItem, selectedField }: ItemProps) => (
  <TouchableOpacity
    onPress={() => {
      selectedItem(item.field);
    }}
  >
    <View style={styles.row}>
      <Text style={{ fontSize: 17, top: 10 }}>{item.value}</Text>
      {equals(selectedField, item.field) ? (
        <Image
          style={{ width: 20, height: 20, top: 12, right: 10 }}
          source={icons.lotLevelActions.iconAccept}
        />
      ) : null}
    </View>
  </TouchableOpacity>
);
const itemValue = prop('value');

const SortModal = ({
  type,
  isModalVisible,
  selectedItem,
  cancelSort,
  selectedField,
  hideClear = false,
}: Props) => (
  <Modal
    transparent
    visible={isModalVisible}
    animationType="slide"
  >
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Header
          cancelSort={cancelSort}
          selectedItem={selectedItem}
          type={type}
          hideClear={hideClear}
        />
        <FlatList
          data={sortOptions[type]}
          keyExtractor={itemValue}
          renderItem={({ item }) => (
            <SortItem
              item={item}
              selectedItem={selectedItem}
              selectedField={selectedField}
            />
          )}
          ItemSeparatorComponent={RowSeparator}
        />
      </View>
    </View>
  </Modal>
);

export default SortModal;
