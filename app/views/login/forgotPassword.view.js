import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import { View } from 'react-native';
import colors from '../../styles/colors';
import { submitForgotPassword } from './login.action';
import Locale from '../../utils/locale';
import { defaultNavStyles } from 'styles';

import Form from './forgotPasswordForm';

type Props = {
  buttonLabel: string,
  submitForgotPassword: Function,
  navigator: Object,
};
class ForgotPasswordForm extends Component<Props> {
  static navigatorButtons = {
    leftButtons: [
      {
        id: 'cancel',
        title: 'Close',
      },
    ],
  };
  static navigatorStyle = defaultNavStyles;

  static defaultProps = {
    buttonLabel: 'Submit',
    handleSubmit: x => x,
  };

  constructor(props) {
    super(props);
    const { navigator } = this.props; // eslint-disable-line
    navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    this.props.navigator.setStyle({
      navBarBackgroundColor: colors.COPART_BLUE,
      navBarTextColor: 'white',
      navBarButtonColor: 'white',
    });
  }

  onNavigatorEvent(event) {
    if (event.id === 'cancel') {
      this.props.navigator.dismissModal();
    }
  }

  handleForgotPasswordSubmit = (values: string) => {
    const data = {
      email: pathOr('', ['userEmail'], values),
    };
    return this.props.submitForgotPassword(data, this.props.navigator); // call action
  };

  closeForgotPassword = () => {
    this.props.navigator.dismissModal();
  };

  render() {
    const { buttonLabel } = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.WHITE,
        }}
      >
        <Form
          onSubmit={this.handleForgotPasswordSubmit}
          buttonLabel={buttonLabel}
          closeForgotPassword={this.closeForgotPassword}
        />
      </View>
    );
  }
}

const mapDispatchToProps = {
  submitForgotPassword,
};
export default connect(undefined, mapDispatchToProps)(ForgotPasswordForm);
