// @flow

import React, { Component } from 'react';
import { Animated, KeyboardAvoidingView, Keyboard, View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { reset, SubmissionError } from 'redux-form';

import { requestCodePushSync } from 'services/codePushSyncer';
import { setOnboardingComplete, setConnectivity } from 'views/settings/settings.action';
import { loginSelector } from './login.redux';
import { authenticateUser, login } from './login.action';

import MessageBox from 'components/core/MessageBox/MessageBox';
import Banner from './components/Banner';
import VersionCard from './components/VersionCard';
import LoginForm from './loginForm';

import messages from 'constants/messages';
import colors from 'styles/colors';
import { defaultNavStyles } from 'styles';
import Locale from 'utils/locale';
import connectionListener from 'utils/ConnectionListener';
import composeErrorMessage from 'utils/mappers/errorMessageMapper';

type Props = {
  +isLoading: true | false,
  +isAuthed: ?(true | false),
  +connectionStatus: true | false,
  +authenticateUser: (username: string, password: string) => any,
  +navigator: any,
  +onboardingComplete: true | false,
  +setOnboardingComplete: () => any,
  +setConnectivity: () => any,
  // +hasAcceptedTerms: true | false,
  +form: Object,
  version: string,
  buildNumber: number,
};

type State = {
  isKeyboardOpen: boolean,
  error?: string,
};

const IMAGE_HEIGHT = 52;
const IMAGE_WIDTH = 150;
const IMAGE_HEIGHT_SMALL = 42;
const IMAGE_WIDTH_SMALL = 120;

class Login extends Component<Props, State> {
  static defaultProps = {
    isLoading: false,
    isAuthed: false,
  };

  state = {
    isKeyboardOpen: false,
    error: null,
  };

  constructor(props) {
    super(props);

    this.keyboardHeight = new Animated.Value(0);
    this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
    this.imageWidth = new Animated.Value(IMAGE_WIDTH);
  }

  componentWillUnmount() {
    this.keyboardWillShowIos1 && this.keyboardWillShowIos1.remove();
    this.keyboardDidShowAndroid1 && this.keyboardDidShowAndroid1.remove();
    this.keyboardWillHideIos2 && this.keyboardWillHideIos2.remove();
    this.keyboardDidHideAndroid2 && this.keyboardDidHideAndroid2.remove();
  }

  componentWillMount() {
    requestCodePushSync();
    connectionListener.register(this);
    //
    this.keyboardWillShowIos1 = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardDidShowAndroid1 = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardWillHideIos2 = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    this.keyboardDidHideAndroid2 = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    //

    if (!this.props.onboardingComplete) {
      this.props.navigator.showModal({
        label: 'Onboarding',
        screen: 'CopartTransporter.Onboarding',
        passProps: {
          onComplete: this.props.setOnboardingComplete,
        },
      });
    }
  }

  openForgotPassword = () => {
    this.props.navigator.showModal({
      label: 'Forgot Password',
      title: Locale.translate('settings.ForgotPassword.Title'),
      screen: 'CopartTransporter.ForgotPassword',
      navigatorStyles: defaultNavStyles,
      navBarBackgroundColor: colors.COPART_BLUE,
    });
  };

  handleSignIn = ({ email, loginPassword }: Object) =>
    this.props.login(email, loginPassword, this.props.navigator).catch((res: Object) => {
      const message = composeErrorMessage(res);
      this.setState({ error: null });
      this.props.resetForm('login');
      if (message) {
        if (message !== this.state.error) {
          this.setState({ error: message });
        }

        throw new SubmissionError({
          _error: message, // as form error
          // email: message, // as field error
          // password: message, // as field error
        });
      }
    });

  willShow = (event) => {
    Animated.parallel([
      Animated.timing(this.imageHeight, {
        duration: event.duration + 100,
        toValue: IMAGE_HEIGHT_SMALL,
      }),
      Animated.timing(this.imageWidth, {
        duration: event.duration + 100,
        toValue: IMAGE_WIDTH_SMALL,
      }),
    ]).start();
    this.setState({
      isKeyboardOpen: true,
    });
  };

  willHide = (event) => {
    let localEvent = null;
    if (!event) {
      localEvent = { duration: 250 };
    } else {
      localEvent = event;
    }
    Animated.parallel([
      Animated.timing(this.imageHeight, {
        duration: localEvent.duration,
        toValue: IMAGE_HEIGHT,
      }),
      Animated.timing(this.imageWidth, {
        duration: localEvent.duration,
        toValue: IMAGE_WIDTH,
      }),
    ]).start();
    this.setState({
      isKeyboardOpen: false,
    });
  };

  keyboardWillShow = (event) => {
    this.willShow(event);
  };

  keyboardWillHide = (event) => {
    this.willHide(event);
    console.log(event);
  };

  keyboardDidShow = (event) => {
    this.willShow(event);
  };

  keyboardDidHide = (event) => {
    this.willHide(event);
  };

  render() {
    const { isLoading, isAuthed, connectionStatus, form, version, buildNumber } = this.props;

    const AnimatedBanner = Animated.createAnimatedComponent(Banner);

    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
          paddingHorizontal: 30,
          paddingBottom: this.keyboardHeight,
          backgroundColor: colors.COPART_BLUE,
        }}
        behavior="padding"
      >
        <View>{isAuthed && <MessageBox
          type="success"
          message={messages.signup.success}
        />}</View>
        <AnimatedBanner
          style={{ marginTop: this.state.isKeyboardOpen ? 70 : 100 }}
          isKeyboardOpen={this.state.isKeyboardOpen}
          // hasError={this.state.error !== null}
          imageHeight={this.imageHeight}
          imageWidth={this.imageWidth}
        />
        <LoginForm
          onSubmit={this.handleSignIn}
          openForgotPassword={this.openForgotPassword}
          isKeyboardOpen={this.state.isKeyboardOpen}
          connectionStatus={connectionStatus}
          loginError={this.state.error}
          loginForm={form}
          isLoading={isLoading}
        />
        <VersionCard
          version={version}
          buildNumber={buildNumber}
        />
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = {
  login,
  authenticateUser,
  setOnboardingComplete,
  setConnectivity,
  resetForm: reset,
};

export default connect(loginSelector, mapDispatchToProps)(Login);
