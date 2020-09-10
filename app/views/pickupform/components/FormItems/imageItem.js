import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import PropTypes from 'prop-types';
import renderIf from 'render-if';

import colors from '../../../../styles/colors';
import { images } from 'constants/icons';

import { formStyles, formNoteStyles } from './styles';
import { Required, Warning } from './flags';
import Locale from 'utils/locale';

const ImageItem = ({
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
        {showWarning && <Warning onPress={() => showWarningNotification({ label })} />}
        <Text style={formStyles.label}>{label}</Text>
        {renderIfIsRequired(<Required />)}
      </View>
      <Text style={formNoteStyles.label}>{Locale.translate('camera.orientation.message')}</Text>
      <View>
        <TouchableOpacity
          onPress={() => {
            if (!value.pathName) {
              openCamera(key1, value, handleOnSelect, type, documentType);
            } else {
              Alert.alert('Select the action you want to perform', null, [
                {
                  text: 'Preview',
                  onPress: () => {
                    handlePreviewClick(key1);
                  },
                },
                {
                  text: 'Retake',
                  onPress: () => {
                    openCamera(key1, value, handleOnSelect, type, documentType);
                  },
                },
                {
                  text: 'Cancel',
                  onPress: () => {},
                },
              ]);
            }
          }}
        >
          <View
            style={{
              width: 150,
              height: 100,
              backgroundColor: !value.pathName ? colors.GRAY_2 : 'transparent',
            }}
          >
            {value.pathName ? (
              <Image
                style={{
                  width: 150,
                  height: 100,
                }}
                resizeMode="center"
                source={{
                  uri: value.pathName,
                }}
              />
            ) : (
              <Image
                style={{
                  top: 30,
                  left: 30,
                }}
                resizeMode="center"
                source={images.automobile}
              />
            )}
            {!value.pathName ? (
              <Text style={{ top: 30, width: 150, textAlign: 'center', fontWeight: 'bold' }}>
                Tap to take picture
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

ImageItem.propTypes = {
  key1: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.objectOf(PropTypes.string).isRequired,
  required: PropTypes.bool.isRequired,
  showWarning: PropTypes.bool.isRequired,
  showWarningNotification: PropTypes.func.isRequired,
  openCamera: PropTypes.func.isRequired,
  handleOnSelect: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  handlePreviewClick: PropTypes.func.isRequired,
  documentType: PropTypes.string.isRequired,
};

ImageItem.defaultProps = {
  label: 'N/A',
  value: {
    pathName: '',
    encoded: '',
    documentType: '',
  },
};
const styles = {
  container: { flex: 1, padding: 10 },
  headerContainer: {
    minHeight: 45,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
};
export default ImageItem;
