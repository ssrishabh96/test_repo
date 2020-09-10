import React, { Component } from 'react';
import { Modal, View, PickerIOS, Text, TouchableOpacity } from 'react-native';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import colors from 'styles/colors';
import styles from './styles';

const TextButton = ({ title, onPress, style }: Object) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[style]}>
      <Text style={{ fontSize: 18, color: colors.COPART_BLUE }}>{title}</Text>
    </View>
  </TouchableOpacity>
);

class UserVehiclePicker extends Component {
  static Item = PickerIOS.Item;
  constructor(props) {
    super(props);
    this.state = {
      showPicker: false,
    };
  }
  handleOnPress = () => {
    this.setState({ showPicker: true });
  };
  handleDoneButtonPress = () => {
    this.setState({ showPicker: false });
  };
  render() {
    return (
      <View>
        <TouchableOpacity
          style={{ alignItems: 'flex-end' }}
          onPress={this.handleOnPress}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>
              {this.state.showPicker ? '' : this.props.selectedValue}
            </Text>
            <FaIcon
              style={{ marginLeft: 5 }}
              name="angle-down"
              size={22}
              color={colors.COPART_BLUE}
            />
          </View>
        </TouchableOpacity>

        <Modal
          margin="0"
          transparent
          visible={this.state.showPicker}
          onBackdropPress={() => this.setState({ showPicker: false })}
          animationType="fade"
        >
          <View style={styles.iosPickerStyle}>
            <View
              style={{
                width: '100%',
                height: 44,
                paddingHorizontal: 20,
                justifyContent: 'center',
                alignItems: 'flex-end',
                backgroundColor: 'white',
              }}
            >
              <TextButton
                title="DONE"
                onPress={this.handleDoneButtonPress}
              />
            </View>
            <PickerIOS
              {...this.props}
              style={{ width: '100%' }}
              itemStyle={{
                backgroundColor: colors.GAINSBORO,
                elevation: 8,
              }}
            >
              {this.props.children}
            </PickerIOS>
          </View>
        </Modal>
      </View>
    );
  }
}
export default UserVehiclePicker;
