import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { RNNNavigator } from 'types/RNNavigation';
import renderIf from 'render-if';
import debounce from 'debounce';

import SignatureCapture from 'react-native-signature-capture';
import RNFS from 'react-native-fs';
import colors from '../../../../styles/colors';
import Locale from 'utils/locale';
import FullScreenLoader from 'components/custom/FullScreenLoader';

type Props = {
  navigator: RNNNavigator,
  key1: string,
  handleOnSelect: Function,
};
class SignatureView extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  state = {
    touched: false,
    hasAppeared: false,
  };
  onNavigatorEvent = (event) => {
    if (event.id === 'didAppear') {
      this.setState({ hasAppeared: true });
    }
  };
  _onSaveEvent = debounce(
    (result) => {
      const newFileName = `${this.props.key1}.png`;
      let pName = result.pathName;
      pName = pName.replace('signature.png', newFileName);

      result.pathName = pName;

      RNFS.writeFile(result.pathName, result.encoded, 'base64')
        .then(() => {})
        .catch(() => {
          // error writing file
        });
      this.props.handleOnSelect(this.props.key1, result);
      this.props.navigator.pop({
        animated: true,
        animationType: 'slide-horizontal',
      });
    },
    400,
    true,
  );
  _onDragEvent = () => {
    if (!this.state.touched) {
      this.setState({ touched: true });
    }
  };
  saveSign() {
    this.refs.sign.saveImage();
  }
  resetSign() {
    this.refs.sign.resetImage();
    this.setState({ touched: false });
  }

  render() {
    const renderIfTouched = renderIf(this.state.touched);
    const renderIfHasAppeared = renderIf(this.state.hasAppeared);
    const renderIfHasNotAppeared = renderIf(!this.state.hasAppeared);
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
        {renderIfHasNotAppeared(
          <View style={styles.signature}>
            <FullScreenLoader />
          </View>,
        )}
        {renderIfHasAppeared(
          <View style={styles.signature}>
            <SignatureCapture
              style={{ flex: 1 }}
              ref="sign"
              showBorder={false}
              onSaveEvent={this._onSaveEvent}
              onDragEvent={this._onDragEvent}
              saveImageFileInExtStorage
              showNativeButtons={false}
              showTitleLabel={false}
              viewMode={'portrait'}
            />
          </View>,
        )}
        <View
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}
        >
          <TouchableHighlight
            style={[styles.buttonStyle, styles.clear]}
            onPress={() => {
              this.resetSign();
            }}
          >
            <Text style={styles.buttonText}>{Locale.translate('PickupForm.Signature.Clear')}</Text>
          </TouchableHighlight>
          {renderIfTouched(
            <TouchableHighlight
              style={[styles.buttonStyle, styles.save]}
              onPress={() => {
                this.saveSign();
              }}
            >
              <Text style={styles.buttonText}>
                {Locale.translate('PickupForm.Signature.Accept')}
              </Text>
            </TouchableHighlight>,
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  signature: {
    borderColor: '#000033',
    borderStyle: 'solid',
    borderWidth: 1,
    width: '100%',
    aspectRatio: 3 / 2,
  },
  buttonStyle: {
    flex: 1,

    top: 30,
    padding: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 45,
    marginRight: 5,
    flexDirection: 'column',
    borderRadius: 20,
  },
  buttonText: { top: 6, color: 'white', fontWeight: 'bold' },
  clear: {
    backgroundColor: colors.DARK_RED,
  },
  save: {
    backgroundColor: colors.DARK_GREEN,
  },
});

export default SignatureView;
