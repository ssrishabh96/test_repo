import React from 'react';

import { PanResponder, View, TouchableHighlight, Animated } from 'react-native';

class MaterialSwitch extends React.Component {
  start = {};

  static defaultProps = {
    active: false,
    style: {},
    buttonStyle: {},
    disabledButtonStyle: {},
    inactiveButtonColor: '#2196F3',
    inactiveButtonPressedColor: '#42A5F5',
    activeButtonColor: '#FAFAFA',
    activeButtonPressedColor: '#F5F5F5',
    buttonShadow: {
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 1,
      shadowOffset: { height: 1, width: 0 },
    },
    activeBackgroundColor: 'rgba(255,255,255,.5)',
    inactiveBackgroundColor: 'rgba(0,0,0,.5)',
    buttonRadius: 15,
    switchWidth: 40,
    switchHeight: 20,
    buttonContent: null,
    enableSlide: true,
    disabled: false,
    switchAnimationTime: 200,
    onActivate() {},
    onDeactivate() {},
    onChangeState() {},
  };

  constructor(props) {
    super(props);
    this.buttonWidth =
      this.props.buttonStyle && this.props.buttonStyle.width
        ? this.props.buttonStyle.width
        : this.props.buttonRadius * 2;
    const w = this.props.switchWidth - this.buttonWidth;
    this.state = {
      width: w,
      state: this.props.active,
      position: new Animated.Value(this.props.active ? w : 0),
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.setState({ pressed: true });
        this.start.x0 = gestureState.x0;
        this.start.pos = this.state.position._value;
        this.start.moved = false;
        this.start.state = this.state.state;
        this.start.stateChanged = false;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!this.props.enableSlide || this.props.disabled) return;
        this.start.moved = true;
        if (this.start.pos == 0) {
          if (gestureState.dx <= this.state.width && gestureState.dx >= 0) {
            this.state.position.setValue(gestureState.dx);
          }
          if (gestureState.dx > this.state.width) {
            this.state.position.setValue(this.state.width);
          }
          if (gestureState.dx < 0) {
            this.state.position.setValue(0);
          }
        }
        if (this.start.pos == this.state.width) {
          if (gestureState.dx >= -this.state.width && gestureState.dx <= 0) {
            this.state.position.setValue(this.state.width + gestureState.dx);
          }
          if (gestureState.dx > 0) {
            this.state.position.setValue(this.state.width);
          }
          if (gestureState.dx < -this.state.width) {
            this.state.position.setValue(0);
          }
        }
        const currentPos = this.state.position._value;
        this.onSwipe(
          currentPos,
          this.start.pos,
          () => {
            if (!this.start.state) this.start.stateChanged = true;
            this.setState({ state: true });
          },
          () => {
            if (this.start.state) this.start.stateChanged = true;
            this.setState({ state: false });
          },
        );
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.setState({ pressed: false });
        const currentPos = this.state.position._value;
        if (
          !this.start.moved ||
          (Math.abs(currentPos - this.start.pos) < 5 && !this.start.stateChanged)
        ) {
          this.toggle();
          return;
        }
        this.onSwipe(currentPos, this.start.pos, this.activate, this.deactivate);
      },
      onPanResponderTerminate: (evt, gestureState) => {
        const currentPos = this.state.position._value;
        this.setState({ pressed: false });
        this.onSwipe(currentPos, this.start.pos, this.activate, this.deactivate);
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      if (nextProps.active) {
        this.activate();
      } else {
        this.deactivate();
      }
    }
  }

  onSwipe = (currentPosition, startingPosition, onChange, onTerminate) => {
    if (currentPosition - startingPosition >= 0) {
      if (
        currentPosition - startingPosition > this.state.width / 2 ||
        startingPosition == this.state.width
      ) {
        onChange();
      } else {
        onTerminate();
      }
    } else if (currentPosition - startingPosition < -this.state.width / 2) {
      onTerminate();
    } else {
      onChange();
    }
  };

  activate = () => {
    Animated.timing(this.state.position, {
      toValue: this.state.width,
      duration: this.props.switchAnimationTime,
    }).start();
    this.changeState(true);
  };

  deactivate = () => {
    Animated.timing(this.state.position, {
      toValue: 0,
      duration: this.props.switchAnimationTime,
    }).start();
    this.changeState(false);
  };

  changeState = (state) => {
    const callHandlers = this.start.state != state;
    setTimeout(() => {
      this.setState({ state });
      if (callHandlers) {
        this.callback();
      }
    }, this.props.switchAnimationTime / 0.9);
  };

  callback = () => {
    const state = this.state.state;
    if (state) {
      this.props.onActivate();
    } else {
      this.props.onDeactivate();
    }
    this.props.onChangeState(state);
  };

  toggle = () => {
    if (!this.props.disabled) {
      if (this.state.state) {
        this.deactivate();
      } else {
        this.activate();
      }
    }
  };
  renderButton = () => (
    <Animated.View
      style={[
        {
          backgroundColor: this.state.state
            ? this.state.pressed
              ? this.props.activeButtonPressedColor
              : this.props.activeButtonColor
            : this.state.pressed
              ? this.props.inactiveButtonPressedColor
              : this.props.inactiveButtonColor,
          height: this.props.buttonRadius * 2,
          width: this.props.buttonRadius * 2,
          borderRadius: this.props.buttonRadius,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          position: 'absolute',
          top: 2 + this.props.switchHeight / 2 - this.props.buttonRadius,
          transform: [{ translateX: this.state.position }],
        },
        this.props.buttonShadow,
        this.props.buttonStyle,
      ]}
      {...this._panResponder.panHandlers}
    >
      {this.props.buttonContent && this.props.buttonContent(this.state.state)}
    </Animated.View>
  );
  renderDisabledButton = () => (
    <Animated.View
      style={[
        {
          backgroundColor: this.state.state
            ? this.props.activeButtonColor
            : this.props.inactiveButtonColor,
          height: this.props.buttonRadius * 2,
          width: this.props.buttonRadius * 2,
          borderRadius: this.props.buttonRadius,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          position: 'absolute',
          top: 2 + this.props.switchHeight / 2 - this.props.buttonRadius,
          transform: [{ translateX: this.state.position }],
        },
        this.props.buttonShadow,
        this.props.buttonStyle,
        this.props.disabledButtonStyle,
      ]}
    >
      {this.props.buttonContent && this.props.buttonContent(this.state.state)}
    </Animated.View>
  );

  render() {
    return (
      <View style={{ padding: 2, position: 'relative' }}>
        <View
          style={[
            {
              backgroundColor: this.state.state
                ? this.props.activeBackgroundColor
                : this.props.inactiveBackgroundColor,
              height: this.props.switchHeight,
              width: this.props.switchWidth,
              borderRadius: this.props.switchHeight / 2,
            },
            this.props.style,
          ]}
        >
          <View
            style={{
              height: Math.max(this.props.buttonRadius * 2 + 2, this.props.switchHeight + 2),
              width: this.props.switchWidth + 2,
              position: 'absolute',
              top: -1,
              // marginHorizontal: 5,
              // marginVertical: 1,
            }}
          >
            {this.props.disabled ? this.renderDisabledButton() : this.renderButton()}
          </View>
        </View>
      </View>
    );
  }
}

export default MaterialSwitch;
