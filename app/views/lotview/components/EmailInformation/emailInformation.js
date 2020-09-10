import React, { Component } from 'react';
import { View, KeyboardAvoidingView, Text, Keyboard } from 'react-native';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import renderIf from 'render-if';

import { requestForms } from '../../lotview.action';

import DefaultInput from 'components/core/FormInput';
import SuccessBox from 'components/custom/FormMessages/successBox';
import ErrorBox from 'components/custom/FormMessages/errorBox';
import Button from 'components/core/Button';

import Locale from '../../../../utils/locale';
import { FormContainer, styles } from './styles';

const AUTHORIZATION = 'authorization';
const DONATION = 'donation';

const validateEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;

type Props = {
  +assignmentDetailId: number,
  +buttonAuthorizationLabel: string,
  +buttonDonationLabel: string,
  +navigator: Object,
  +handleSubmit: Function,
  +error: string | null,
  +submitting: boolean,
  +requestForms: Function,
};
class EmailInformation extends Component<Props> {
  static defaultProps = {
    buttonAuthorizationLabel: Locale.translate('LotDetail.Email.AuthorizationButtonTitle'),
    buttonDonationLabel: Locale.translate('LotDetail.Email.DonationButtonTitle'),
  };
  static navigatorButtons = {
    leftButtons: [
      {
        id: 'cancel',
        title: 'Close',
      },
    ],
  };

  constructor(props) {
    super(props);
    const { navigator } = this.props; // eslint-disable-line
    navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.state = {
      [AUTHORIZATION]: {
        submitting: false,
        submitSucceeded: false,
      },
      [DONATION]: {
        submitting: false,
        submitSucceeded: false,
      },
    };
  }

  onNavigatorEvent(event) {
    if (event.id === 'cancel') {
      this.props.navigator.dismissModal();
    }
  }
  onSubmit = (values, type) => {
    Keyboard.dismiss();
    this.setState({ [type]: { submitting: true, submitSucceeded: false } });
    return this.props
      .requestForms(this.props.assignmentDetailId, { type, ...values })
      .then(() => {
        this.setState({ [type]: { submitting: false, submitSucceeded: true } });
      })
      .catch((err) => {
        this.setState({ [type]: { submitting: false, submitSucceeded: false } });
        throw err;
      });
  };
  render() {
    const { handleSubmit, error, submitting } = this.props;
    const { [AUTHORIZATION]: authorization, [DONATION]: donation } = this.state;

    const renderIfAuthSuccess = renderIf(
      !authorization.submitting && authorization.submitSucceeded,
    );
    const renderIfDonSuccess = renderIf(!donation.submitting && donation.submitSucceeded);
    const renderIfError = renderIf(!submitting && error);
    return (
      <View style={styles.view}>
        {renderIfAuthSuccess(<SuccessBox message="Request for authorization document sent" />)}
        {renderIfDonSuccess(<SuccessBox message="Request for donation document sent" />)}
        {renderIfError(<ErrorBox message={error} />)}
        <FormContainer>
          <KeyboardAvoidingView
            behavior="padding"
            marginTop="25%"
            resetScrollToCoords={{ x: 0, y: 0 }}
          >
            <View style={styles.margin50}>
              <Text style={styles.label}>{Locale.translate('LotDetail.Email.infoText')}</Text>
              <Field
                name="email"
                placeholder={Locale.translate('LotDetail.Email')}
                maxLength={50}
                autoCapitalize="none"
                keyboardType="email-address"
                component={DefaultInput}
                validate={validateEmail}
              />
            </View>
          </KeyboardAvoidingView>
          <Button
            onPress={handleSubmit(v => this.onSubmit(v, AUTHORIZATION))}
            style={styles.button}
            isLoading={this.state[AUTHORIZATION].submitting}
            disabled={this.state[DONATION].submitting}
            title={this.props.buttonAuthorizationLabel}
          />
          <Button
            onPress={handleSubmit(v => this.onSubmit(v, DONATION))}
            style={styles.button}
            isLoading={this.state[DONATION].submitting}
            disabled={this.state[AUTHORIZATION].submitting}
            title={this.props.buttonDonationLabel}
          />
        </FormContainer>
      </View>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = Locale.translate('LotDetail.Email.error');
  }
  return errors;
};
const emailInformation = reduxForm({
  form: 'emailInformation',
  validate,
})(EmailInformation);

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  requestForms,
};
export default connect(mapStateToProps, mapDispatchToProps)(emailInformation);
