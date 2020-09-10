import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import renderIf from 'render-if';
import PropTypes from 'prop-types';
import { pick } from 'ramda';

import colors from 'styles/colors';
import Locale from 'utils/locale';
import Button from 'components/core/Button';
import { submitChangePassword, signoutUser } from './login.action';
import SuccessBox from 'components/custom/FormMessages/successBox';
import ChangePasswordForm from './changePasswordForm';

class ChangePasswordView extends Component {
  static propTypes = {
    submitChangePassword: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired, // eslint-disable-line
    loggedIn: PropTypes.bool.isRequired,
    signoutUser: PropTypes.func.isRequired,
    resolve: PropTypes.func,
    reject: PropTypes.func,
  };

  static defaultProps = {
    onCancel: x => x,
    resolve: x => x,
    reject: x => x,
  };
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  state = { submitted: false };
  componentDidMount() {
    this.props.navigator.setStyle({
      navBarBackgroundColor: colors.COPART_BLUE,
      navBarTextColor: 'white',
      navBarButtonColor: 'white',
    });
  }
  onNavigatorEvent(event) {
    if (event.id === 'backPress') {
      if (this.state.submitted) this.handleContinue();
      else this.cancleChangePassword();
    }
  }
  setSubmitted = () => {
    this.setState({ submitted: true });
  };
  handlePasswordUpdate = (values: string) => {
    const fields = ['newPassword', 'oldPassword'];
    const data = pick(fields, values);
    return this.props.submitChangePassword(data).then(this.setSubmitted);
  };
  cancleChangePassword = () => {
    this.props.navigator.dismissModal();
    return this.props.reject();
  };
  handleContinue = () => {
    if (this.props.loggedIn) this.props.signoutUser();
    else this.props.navigator.dismissModal();
    return this.props.reject();
  };
  render() {
    const renderifSubmitSucceded = renderIf(this.state.submitted);
    const renderifNotSubmitSucceded = renderIf(!this.state.submitted);
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.WHITE,
        }}
      >
        {renderifSubmitSucceded(
          <SuccessBox
            message={Locale.translate('settings.ChangePassword.SuccessMessage')}
            style={styles.margin10}
          />,
        )}
        {renderifNotSubmitSucceded(
          <ChangePasswordForm
            cancleChangePassword={this.cancleChangePassword}
            onSubmit={this.handlePasswordUpdate}
          />,
        )}
        {renderifSubmitSucceded(
          <View style={styles.buttonContainer}>
            <Button
              onPress={this.handleContinue}
              style={{ backgroundColor: 'green', borderRadius: 50 }}
              title={Locale.translate('settings.ChangePassword.Continue')}
            />
          </View>,
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
});
const mapDispatchToProps = {
  submitChangePassword,
  signoutUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordView);
const styles = StyleSheet.create({
  buttonContainer: { flex: 1, justifyContent: 'center', padding: 10 },
  margin10: { margin: 10 },
});
