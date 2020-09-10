import React, { Component } from 'react';
import { View, Modal, Text, TouchableHighlight, Image } from 'react-native';
import PropTypes from 'prop-types';

const modalBackgroundStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  flexDirection: 'column',
  flex: 1,
  justifyCenter: 'center',
  alignItems: 'center',
};

const modalViewStyle = {
  flexDirection: 'row',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 30,
  padding: 0,
  borderRadius: 5,
};

class ImagePreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  componentWillMount() {
    const { showPreview } = this.props;
    this.setModalVisible(showPreview);
  }

  componentWillReceiveProps(newProps) {
    const { showPreview } = newProps;
    const { props } = this;
    if (props.showPreview !== showPreview) {
      this.setModalVisible(showPreview);
    }
  }

  setModalVisible(visible) {
    this.setState({
      modalVisible: visible,
    });
  }

  openImageCamera() {
    this.props.closePreview();
  }
  render() {
    const filePath = this.props.imagePreview.previewPath;
    return (
      <View>
        <Modal
          animationType={'slide'}
          transparent
          visible={this.state.modalVisible}
        >
          {filePath && (
            <View style={[modalBackgroundStyle, modalViewStyle]}>
              {this.props.modalId === 'imagePreview' && (
                <View style={[{ backgroundColor: 'transparent' }, { top: -50 }]}>
                  <View
                    style={[
                      { flexDirection: 'row' },
                      { backgroundColor: '#002c7a' },
                      { height: 45 },
                      { borderRadius: 3 },
                    ]}
                  >
                    <TouchableHighlight
                      underlayColor="transparent"
                      onPress={() => {
                        this.props.closePreview();
                      }}
                    >
                      <Text
                        style={[
                          { color: 'white' },
                          { marginLeft: 12 },
                          { marginTop: 8 },
                          { fontSize: 16 },
                          { marginTop: 8 },
                        ]}
                      >
                        Cancel
                      </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      underlayColor="transparent"
                      onPress={() => {
                        this.props.deleteImagePreview(filePath, this.props.imagePreview);
                      }}
                    >
                      <Text
                        style={[
                          { marginLeft: 230 },
                          { color: 'white' },
                          { fontSize: 16 },
                          { marginTop: 8 },
                        ]}
                      >
                        Delete
                      </Text>
                    </TouchableHighlight>
                  </View>
                  <Image
                    style={{ width: 350, height: 260 }}
                    source={{ uri: filePath }}
                  />
                </View>
              )}
            </View>
          )}
        </Modal>
      </View>
    );
  }
}

ImagePreviewModal.propTypes = {
  showPreview: PropTypes.bool.isRequired,
  modalId: PropTypes.string.isRequired,
  closePreview: PropTypes.func.isRequired,
  imagePreview: PropTypes.Object,
  deleteImagePreview: PropTypes.func.isRequired,
};
ImagePreviewModal.defaultProps = {
  showModal: false,
  imagePreview: {},
};
export default ImagePreviewModal;
