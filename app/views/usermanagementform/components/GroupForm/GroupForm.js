import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import { reduxForm, Field, change, getFormValues } from 'redux-form';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';

import DefaultInput from 'components/core/FormInput';
import PickerInput from 'components/core/FormInput/pickerInput';
import Button from 'components/core/Button';

class GroupForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onGroupFormSubmit: PropTypes.func.isRequired,
    openCountryPicker: PropTypes.func.isRequired,
    openStatePicker: PropTypes.func.isRequired,
    onCountrySelect: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    isCountrySelected: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    buttonLabel: PropTypes.string,
    groupFormValues: PropTypes.object, // eslint-disable-line
    navigator: PropTypes.object.isRequired, // eslint-disable-line
  };

  static defaultProps = {
    submitting: false,
    buttonLabel: 'Add Group',
    isCountrySelected: true,
    handleSubmit: x => x,
    onGroupFormSubmit: x => x,
    onCancel: x => x,
  };

  componentDidMount() {
    this.props.navigator.setTitle({
      title: 'New Group Form',
    });
  }

  handleCountrySelect = (cb) => {
    this.props.onCountrySelect(cb);
    this.props.dispatch(change('groupForm', 'state', ''));
  };

  render() {
    const {
      onGroupFormSubmit,
      openCountryPicker,
      // onCountrySelect,
      openStatePicker,
      onCancel,
      handleSubmit,
      submitting,
      buttonLabel,
    } = this.props;

    const isCountrySelected = pathOr(false, ['groupFormValues', 'country'])(this.props);

    return (
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginBottom: 30 }}
        >
          <KeyboardAvoidingView
            behavior="padding"
            resetScrollToCoords={{ x: 0, y: 0 }}
          >
            <Field
              name="newGroupName"
              placeholder="Group Name"
              autoCapitalize="words"
              maxLength={50}
              component={DefaultInput}
              autoFocus
            />
            <Field
              name="contactName"
              placeholder="Contact Name"
              autoCapitalize="words"
              maxLength={50}
              component={DefaultInput}
              autoFocus
            />
            <Field
              name="emailId"
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              maxLength={50}
              component={DefaultInput}
              autoFocus
            />
            <Field
              name="phone"
              placeholder="Phone"
              autoCapitalize="words"
              keyboardType="numeric"
              maxLength={50}
              component={DefaultInput}
              autoFocus
              // normalize={normalizePhone} // TODO: Format phone number input
            />
            <Field
              name="city"
              placeholder="City"
              autoCapitalize="words"
              keyboardType="default"
              maxLength={50}
              component={DefaultInput}
              autoFocus
            />
            <Field
              name="country"
              placeholder="Country"
              isPicker
              onOpenPicker={openCountryPicker}
              placeholderValue={'Country'}
              component={props => (
                <PickerInput
                  {...props}
                  onCountrySelect={this.handleCountrySelect}
                />
              )}
            />
            <Field
              name="state"
              placeholder="State"
              isPicker
              isDisabled={isCountrySelected}
              onOpenPicker={openStatePicker}
              placeholderValue={'State'}
              component={props => <PickerInput {...props} />}
            />
            <Field
              name="zipcode"
              placeholder="Zipcode"
              autoCapitalize="words"
              keyboardType="numeric"
              maxLength={5}
              component={DefaultInput}
              autoFocus
              // normalize={normalizePhone}
            />
          </KeyboardAvoidingView>
          <View style={{ marginTop: 20 }}>
            <Button
              onPress={handleSubmit(onGroupFormSubmit)}
              style={{ borderRadius: 50, marginBottom: 10 }}
              title={buttonLabel}
              isLoading={submitting}
            />
            <Button
              onPress={onCancel}
              style={{ backgroundColor: '#c62828', borderRadius: 50 }}
              title={'Cancel'}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.newGroupName) errors.newGroupName = 'Required';
  if (!values.contactName) errors.contactName = 'Required';
  if (!values.emailId) errors.emailId = 'Required';
  if (!values.phone) errors.phone = 'Required';
  if (!values.city) errors.city = 'Required';
  if (!values.country || values.country === '') {
    errors.country = 'Please select a Country';
  }
  if (!values.state || values.state === '') {
    errors.state = 'Please select a State';
  }
  if (!values.zipcode) errors.zipcode = 'Required';
  return errors;
};

const groupForm = reduxForm({
  form: 'groupForm',
  validate,
})(GroupForm);

export default connect(state => ({
  groupFormValues: getFormValues('groupForm')(state),
}))(groupForm);
