import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';

// import PickerInput from 'components/core/FormInput/pickerInput';
import DefaultInput from 'components/core/FormInput';
import AutoFlow from 'components/core/FormInput/AutoFlow';
import DatePickerInput from 'components/core/DatePicker';
import Button from 'components/core/Button';

// import icons from '../../../constants/icons';
import createDriverFormValidations, {
  nameValidation,
  contactNumValidation,
  emailValidation,
} from 'utils/formValidations/createDriverFormValidations';

class DriverForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onDriverFormSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    buttonLabel: PropTypes.string,
    // action: PropTypes.string,
    editable: PropTypes.arrayOf(PropTypes.string),
    driver: PropTypes.object, // eslint-disable-line
    navigator: PropTypes.object.isRequired, // eslint-disable-line
    // onCancel: PropTypes.func.isRequired,
    // openGroupPicker: PropTypes.func,
  };

  static defaultProps = {
    submitting: false,
    buttonLabel: 'Submit',
    action: 'create',
    driver: {},
    editable: [],
    handleSubmit: x => x,
    onCancel: x => x,
    openGroupPicker: x => x,
  };
  render() {
    const {
      onDriverFormSubmit,
      handleSubmit,
      submitting,
      buttonLabel,
      // onCancel,
      // openGroupPicker,
      editable,
      // action,
    } = this.props;
    return (
      <View
        style={{
          flex: 1,
          marginBottom: 10,
        }}
      >
        {/* <KeyboardAvoidingView
          behavior="padding"
          style={{ marginBottom: 30 }}
          // resetScrollToCoords={{ x: 0, y: 0 }}
          // scrollEnabled={false}
      > */}
        <View style={{ marginBottom: 30 }}>
          <AutoFlow>
            <Field
              name="driverFName"
              placeholder="First Name*"
              maxLength={50}
              component={DefaultInput}
              keyboardType="default"
              validate={nameValidation}
              editable={editable}
            />
            <Field
              name="driverMName"
              placeholder="Middle Name"
              maxLength={50}
              component={DefaultInput}
              keyboardType="default"
              validate={nameValidation}
              editable={editable}
            />
            <Field
              name="driverLName"
              placeholder="Last Name*"
              maxLength={50}
              component={DefaultInput}
              keyboardType="default"
              validate={nameValidation}
              editable={editable}
            />
            {/* (action !== 'create' || action !== 'edit') && (
            <Field
              name="driverGroup"
              placeholder="Group*"
              isPicker
              onOpenPicker={openGroupPicker}
              placeholderValue={'Group'}
              component={PickerInput}
              editable={editable}
            />
          ) */}
            <Field
              name="driverContactNumber"
              placeholder="Contact Number*"
              maxLength={50}
              component={DefaultInput}
              keyboardType="numeric"
              validate={contactNumValidation}
              editable={editable}
              returnKeyType="done" // helps closing numeric keyboards
            />
            <Field
              name="driverEmail"
              placeholder="Email Address*"
              autoCapitalize="none"
              keyboardType="email-address"
              maxLength={50}
              component={DefaultInput}
              validate={emailValidation}
              editable={editable}
            />
            <Field
              name="driverStartDate"
              placeholder="Start Date*"
              component={DatePickerInput}
              editable={editable}
            />
          </AutoFlow>
        </View>
        {/* </KeyboardAvoidingView> */}
        <Button
          onPress={handleSubmit(onDriverFormSubmit)}
          style={{ borderRadius: 50, marginBottom: 10 }}
          titleStyle={{ fontSize: 16 }}
          title={buttonLabel}
          isLoading={submitting}
        />
      </View>
    );
  }
}

const driverForm = reduxForm({
  form: 'driverForm',
  validate: createDriverFormValidations,
  enableReinitialize: true,
})(DriverForm);

const mapStateToProps = (state, ownProps) => {
  const { action, driver, groups } = ownProps;
  let group = null;
  if (driver) {
    group = groups.find(g => g.dispatchGroupId === driver.vendorId);
  }
  let driverFormInitialValue = {};
  if (action === 'edit' || action === 'driverProfile') {
    driverFormInitialValue = {
      driverFName: driver.firstName,
      driverMName: driver.middleName || null,
      driverLName: driver.lastName,
      driverContactNumber: driver.phoneNum,
      driverGroup: (group && group.name && group.name.toUpperCase()) || 'Please choose a Group',
      driverEmail: driver.email,
      driverStartDate: (driver.startDate && moment(driver.startDate).format('YYYY-MM-DD')) || 'N/A',
    };
  }
  return {
    initialValues: driverFormInitialValue,
  };
};

export default connect(mapStateToProps)(driverForm);
