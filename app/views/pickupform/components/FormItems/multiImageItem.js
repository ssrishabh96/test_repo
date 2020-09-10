import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TouchableHighlight,
  Alert,
} from 'react-native';
import renderIf from 'render-if';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import colors from '../../../../styles/colors';
import { formStyles } from './styles';
import { Required, Warning } from './flags';

const onPress = (
  item: Object,
  key1: string,
  handlePreviewClick: () => any,
  openCamera: () => any,
  value,
  handleOnSelect: () => any,
  type,
  documentType,
) => {
  if (item.image.pathName) {
    Alert.alert('Select the action you want to perform', null, [
      {
        text: 'Preview',
        onPress: () => {
          handlePreviewClick(key1, item);
        },
      },
      {
        text: 'Retake',
        onPress: () => {
          openCamera(key1, value, handleOnSelect, type, documentType, item);
        },
      },
      {
        text: 'Cancel',
        onPress: () => {},
      },
    ]);
  }
};
const MultiImageItem = ({
  /* id, */
  key1,
  label,
  value,
  required,
  showWarning,
  showWarningNotification,
  openCamera,
  handleOnSelect,
  type,
  handlePreviewClick,
  documentType,
}) => {
  const renderIfIsRequired = renderIf(required);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.labelContainer}>
          {showWarning && <Warning onPress={() => showWarningNotification({ label })} />}
          <Text style={formStyles.label}>{label}</Text>
          {renderIfIsRequired(<Required />)}
        </View>
        <TouchableOpacity
          onPress={() => {
            openCamera(key1, value, handleOnSelect, type, documentType);
          }}
        >
          <Icon
            size={22}
            name={'camera'}
            color={colors.TEXT_DARK}
            style={{ paddingRight: 5 }}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={value}
        horizontal
        renderItem={({ item }) => (
          <TouchableHighlight
            onPress={() =>
              onPress(
                item,
                key1,
                handlePreviewClick,
                openCamera,
                value,
                handleOnSelect,
                type,
                documentType,
              )
            }
          >
            <View style={{ width: 150, height: 100, margin: 5 }}>
              <Image
                style={{
                  width: 150,
                  height: 100,
                  margin: 5,
                }}
                resizeMode="center"
                source={{
                  uri: item.image.pathName,
                }}
              />
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
};

MultiImageItem.propTypes = {
  key1: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.objectOf(PropTypes.string)]),
    ),
  ),
  required: PropTypes.bool.isRequired,
  showWarning: PropTypes.bool.isRequired,
  showWarningNotification: PropTypes.func.isRequired,
  openCamera: PropTypes.func.isRequired,
  handleOnSelect: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  handlePreviewClick: PropTypes.func.isRequired,
};

MultiImageItem.defaultProps = {
  label: 'N/A',
  value: [],
};
const styles = {
  container: { flex: 1, padding: 10 },
  headerContainer: {
    minHeight: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 3,
  },
};
export default MultiImageItem;
