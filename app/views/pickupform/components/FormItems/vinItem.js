import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import renderIf from 'render-if';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import { formStyles } from './styles';
import colors from '../../../../styles/colors';
import { Required, Warning } from './flags';

const TextItem = ({
  /* id, */
  key1,
  label,
  value,
  required,
  showWarning,
  handleOnSelect,
  showWarningNotification,
  showScannerView,
}) => {
  const renderIfIsRequired = renderIf(required);
  return (
    <View
      style={{
        flex: 1,
        minHeight: 45,
        padding: 10,
        flexDirection: 'column',
        borderColor: '#F8F8F8',
        borderBottomWidth: 1,
      }}
    >
      <View style={styles.headerContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: 5,
          }}
        >
          {showWarning && <Warning onPress={() => showWarningNotification({ label })} />}
          <Text style={formStyles.label}>{label}</Text>
          {renderIfIsRequired(<Required />)}
        </View>
        <TouchableOpacity
          onPress={() => {
            showScannerView(label, key1);
          }}
        >
          <Icon
            size={22}
            name={'barcode'}
            color={colors.TEXT_DARK}
            style={{ paddingRight: 5 }}
          />
        </TouchableOpacity>
      </View>
      <TextInput
        style={[formStyles.value, { height: 40, borderColor: 'gray', borderWidth: 1, padding: 10 }]}
        value={value}
        maxLength={17}
        placeholder={'XXXXXX'}
        onChangeText={text => handleOnSelect(key1, text)}
        underlineColorAndroid="transparent"
        autoCapitalize="characters"
      />
    </View>
  );
};

TextItem.propTypes = {
  label: PropTypes.string.isRequired,
  key1: PropTypes.string.isRequired,
  value: PropTypes.string,
  required: PropTypes.bool.isRequired,
  showWarning: PropTypes.bool.isRequired,
  handleOnSelect: PropTypes.func.isRequired,
  showWarningNotification: PropTypes.func.isRequired,
  showScannerView: PropTypes.func.isRequired,
};

TextItem.defaultProps = {
  label: 'N/A',
  value: '',
};
const styles = {
  container: { flex: 1, padding: 10 },
  headerContainer: {
    minHeight: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
};

export default TextItem;
