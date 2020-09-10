// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';

import { submitSignUpForm, clearMessages } from './signup.actions';
import { singUpSelector } from './signup.redux';

import SignUpForm from './component/SignUpForm';
import MessageBox from '../../components/core/MessageBox/MessageBox';

import colors from '../../styles/colors';

import { Props, State } from './types';

class SignUp extends Component<Props, State> {
  static propTypes = {
    clearMessages: PropTypes.func.isRequired,
    submitSignUpForm: PropTypes.func.isRequired,
    err: PropTypes.string.isRequired,
    isRegistered: PropTypes.bool.isRequired,
    navigator: PropTypes.object.isRequired, // eslint-disable-line
  };

  static defaultProps = {
    submitting: false,
    message: null,
    err: null,
    clearMessages: (x: any) => x,
    isRegistered: false,
  };

  static navigatorStyle = {
    navBarTextColor: '#fff',
    navBarBackgroundColor: colors.COPART_BLUE,
    navBarButtonColor: '#fff',
    navBarTitleTextCentered: true,
    navBarButtonFontSize: 10,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.isRegistered) {
      setTimeout(() => {
        this.props.navigator.resetTo({
          screen: 'CopartTransporter.Login',
          title: 'LOGIN',
          animated: true,
          animationType: 'fade',
          navigatorStyle: {
            navBarBackgroundColor: colors.COPART_BLUE,
            navBarTextColor: '#fff',
          },
          passProps: {
            isAuthed: true,
          },
        });
      }, 1000);
      this.props.clearMessages();
    }
  }

  componentWillUnmount() {
    this.props.clearMessages();
  }

  handleFormSubmit = (values: any) => {
    const { submitSignUpForm: submitForm } = this.props;
    return values && submitForm && submitForm(values);
  };

  render() {
    const { err } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {!!err && <MessageBox
          type="error"
          message={err}
        />}
        <SignUpForm onFormSubmit={this.handleFormSubmit} />
      </View>
    );
  }
}

const mapDispatchToProps = {
  submitSignUpForm,
  clearMessages,
};

export default connect(singUpSelector, mapDispatchToProps)(SignUp);
