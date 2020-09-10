import React from 'react';
import { SegmentedControlIOS } from 'react-native';
import PropTypes from 'prop-types';

const SegmentControl = ({ values, selectedIndex, onChange }) => (
  <SegmentedControlIOS
    style={{ height: 40 }}
    values={values}
    selectedIndex={selectedIndex}
    onChange={(event) => {
      onChange(event.nativeEvent.selectedSegmentIndex);
    }}
  />
);

SegmentControl.propTypes = {
  
};

export default SegmentControl;
