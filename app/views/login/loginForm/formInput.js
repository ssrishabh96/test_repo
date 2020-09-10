import React from 'react';
import { TextInput, View, Text } from 'react-native';
import renderIf from 'render-if';

import styles from './styles';
// import ErrorBox from './errorBox';

type Props = {
  input: Object,
  meta: Object,
  extraProps: Object,
};
export default ({ input, meta, ...extraProps }: Props) => {
  const notValid = !meta.valid && meta.touched;
  const renderIfErrors = renderIf(notValid && !meta.submitting);
  return (
    <View style={null}>
      <TextInput
        {...input}
        {...extraProps}
        style={[styles.textInput, notValid ? styles.errorInput : null]}
        underlineColorAndroid="transparent"
        placeholderTextColor="white"
        autoCapitalize="none"
        selectionColor="white"
      />
      {renderIfErrors(<Text style={[styles.errorText]}>{meta.error}</Text>)}
      {/* renderIfErrors(<ErrorBox message={meta.error} />) */}
    </View>
  );
};
