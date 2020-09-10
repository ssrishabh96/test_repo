import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import renderIf from 'render-if';
import { Required, Warning } from './flags';
import colors from '../../../../styles/colors';
import { formStyles } from './styles';

function renderImage(value) {
  if (!value || value.encoded === '') {
    return (
      // -- placeholder white square
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          minHeight: 80,
          backgroundColor: 'white',
          borderColor: 'gray',
          borderWidth: 1,
        }}
      />
    );
  }
  return (
    <Image
      source={{ uri: `data:image/png;base64,${value.encoded}` }}
      style={{
        height: 80,
        resizeMode: Image.resizeMode.contain,
        borderWidth: 1,
        borderColor: 'gray',
      }}
    />
  );
}

function SignatureItem({
  key1,
  label,
  value,
  required,
  showWarning,
  showSignatureView,
  showWarningNotification,
}) {
  const renderIfIsRequired = renderIf(required);
  return (
    <TouchableOpacity onPress={() => showSignatureView(label, key1)}>
      <View
        style={{
          flex: 1,
          padding: 10,
          flexDirection: 'column',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingTop: 3,
          }}
        >
          {showWarning && <Warning onPress={() => showWarningNotification({ label })} />}
          <Text style={formStyles.label}>{label}</Text>
          {renderIfIsRequired(<Required />)}
        </View>
        {renderImage(value)}
      </View>
    </TouchableOpacity>
  );
}

SignatureItem.propTypes = {
  key1: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.objectOf(PropTypes.string).isRequired,
  required: PropTypes.bool.isRequired,
  showWarning: PropTypes.bool.isRequired,
  showSignatureView: PropTypes.func.isRequired,
  showWarningNotification: PropTypes.func.isRequired,
};
SignatureItem.defaultProps = {
  value: {
    pathName: '',
    encoded: '',
  },
};
export default SignatureItem;
