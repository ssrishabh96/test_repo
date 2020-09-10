import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import SegmentControl from './SegmentControl';

class SegmentBar extends Component {
  static defaultProps = {
    values: [],
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }
  render() {
    const { values, onChange } = this.props;
    return (
      <View>
        <SegmentControl
          values={values}
          selectedIndex={this.state.selectedIndex}
          onChange={(selectedSegmentIndex) => {
            this.setState({ selectedIndex: selectedSegmentIndex });
            if (onChange) {
              onChange(selectedSegmentIndex, values[selectedSegmentIndex]);
            }
          }}
        />
      </View>
    );
  }
}

SegmentBar.propTypes = {

};

export default SegmentBar;
