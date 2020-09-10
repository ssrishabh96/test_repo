import React from 'react';
import { connect } from 'react-redux';
import renderIf from 'render-if';
import { Modal, View, Text, TouchableWithoutFeedback } from 'react-native';
import { dismissToolTips, unviewPage } from 'views/settings/settings.action';
import TipsMapper from './tips';

type Props = {
  +visible: boolean,
  +page: string,
  +dismissToolTips: () => any,
};
class ToolTipOverlay extends React.Component<Props> {
  state = {
    visible: false,
  };
  componentDidMount() {
    this.props.navigator.screenIsCurrentlyVisible().then((screenVisible) => {
      if (screenVisible && this.props.visible) {
        this.setState({
          visible: screenVisible,
        }); // prevents popup if that screen isnt actually on top.
      }
    });
  }
  renderToolTip = ({ direction, text, popupStyle }) => {
    const renderIfDirectionIsDownOrRight = renderIf(direction === 'DOWN' || direction === 'RIGHT');
    const renderIfDirectionIsUPOrLeft = renderIf(direction === 'UP' || direction === 'LEFT');
    return (
      <View
        style={[DirectionsMapper[direction].wrapperStyle, popupStyle]}
        key={text}
      >
        {renderIfDirectionIsUPOrLeft(<View style={[DirectionsMapper[direction].triangleStyle]} />)}
        <View style={[styles.popup]}>
          <Text style={[styles.text, { fontWeight: 'bold' }]}>Tip: </Text>
          <Text style={styles.text}>{text}</Text>
        </View>
        {renderIfDirectionIsDownOrRight(
          <View style={[DirectionsMapper[direction].triangleStyle]} />,
        )}
      </View>
    );
  };
  render() {
    console.log('redered!');
    const renderIfToolTipEnabled = renderIf(this.state.visible);
    return (
      <View>
        {renderIfToolTipEnabled(
          <Modal transparent>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ visible: false }, () => {});
                this.props.dismissToolTips(this.props.page);
              }}
            >
              <View style={styles.wrapper}>
                {TipsMapper[this.props.page].map(tip => this.renderToolTip(tip))}
              </View>
            </TouchableWithoutFeedback>
          </Modal>,
        )}
      </View>
    );
  }
}

const mapDispatchToProps = {
  dismissToolTips,
};
const mapStateToProps = (state, ownProps) => ({
  visible: !state.settings.tooltip.hasViewedPages[ownProps.page],
});
export default connect(mapStateToProps, mapDispatchToProps)(ToolTipOverlay);

const darkGray = '#333';
const DirectionsMapper = {
  DOWN: {
    triangleStyle: {
      borderColor: 'transparent',
      borderTopColor: darkGray,
      borderTopWidth: 15,
      borderRightWidth: 5,
      borderLeftWidth: 5,
      width: 0,
      height: 0,
      marginLeft: 10,
      marginTop: -2,
    },
    wrapperStyle: { flexDirection: 'column' },
  },
  RIGHT: {
    triangleStyle: {
      borderColor: 'transparent',
      borderLeftColor: darkGray,
      borderLeftWidth: 15,
      borderTopWidth: 5,
      borderBottomWidth: 5,
      width: 0,
      height: 0,
      marginLeft: -2,
      marginTop: 10,
    },
    wrapperStyle: { flexDirection: 'row' },
  },
  LEFT: {
    triangleStyle: {
      borderColor: 'transparent',
      borderRightColor: darkGray,
      borderRightWidth: 15,
      borderTopWidth: 5,
      borderBottomWidth: 5,
      width: 0,
      height: 0,
      marginRight: -2,
      marginTop: 10,
    },
    wrapperStyle: { flexDirection: 'row' },
  },
  UP: {
    triangleStyle: {
      borderColor: 'transparent',
      borderBottomColor: darkGray,
      borderBottomWidth: 15,
      borderRightWidth: 5,
      borderLeftWidth: 5,
      width: 0,
      height: 0,
      marginLeft: 10,
      marginBottom: -2,
    },
    wrapperStyle: { flexDirection: 'column' },
  },
  NONE: {
    triangleStyle: {},
    wrapperStyle: {},
  },
};
const styles = {
  wrapper: {
    flex: 1,
    backgroundColor: '#00000077',
  },
  popup: {
    backgroundColor: darkGray,
    padding: 10,
    borderRadius: 8,
  },
  text: {
    color: 'white',
  },
};
