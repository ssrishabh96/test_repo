import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/FontAwesome';

const Row = ({ children, chevron, containerStyle, style, bottomBorder, bottomBorderStyle }) => (
  <View
    style={[
      styles.container,
      containerStyle,
      bottomBorder ? bottomBorderStyle || styles.bottomBorder : null,
    ]}
  >
    <View style={[style, { flex: 1 }]}>{children}</View>
    {chevron ? (
      <View style={styles.chevron}>
        <Icon
          size={22}
          name={'angle-right'}
          color={'black'}
          style={{ marginHorizontal: 5 }}
        />
      </View>
    ) : null}
  </View>
);

Row.propTypes = {
  chilren: PropTypes.node,
  chevron: PropTypes.bool,
  // containerStyle: View.propTypes.style,
  // style: View.propTypes.style,
  bottomBorder: PropTypes.bool,
  // bottomBorderStyle: View.propTypes.style,
};
Row.defaultProps = {
  chevron: false,
  style: null,
  containerStyle: null,
  bottomBorder: false,
  bottomBorderStyle: null,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 40,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E5E8',
  },
  chevron: { justifyContent: 'center', marginRight: 5 },
});

export default Row;
