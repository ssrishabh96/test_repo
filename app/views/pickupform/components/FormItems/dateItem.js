import React from 'react';
import { View, Text } from 'react-native';
import renderIf from 'render-if';
import DatePicker from 'react-native-datepicker';
import PropTypes from 'prop-types';
import colors from '../../../../styles/colors';
import { formStyles } from './styles';
import { Required, Warning } from './flags';

const DateItem = ({
  /* id, */
  key1,
  label,
  value,
  required,
  showWarning,
  handleDateChange,
  showWarningNotification,
}) => {
  const renderIfIsRequired = renderIf(required);
  return (
    <View
      style={{
        flex: 1,
        minHeight: 45,
        paddingLeft: 10,
        paddingTop: 5,
        paddingRight: 8,
        flexDirection: 'column',
        borderColor: '#F8F8F8',
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          paddingBottom: 5,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        {showWarning && <Warning onPress={() => showWarningNotification({ label })} />}
        <Text style={formStyles.label}>{label}</Text>
        {renderIfIsRequired(<Required />)}
      </View>
      <DatePicker
        customStyles={{
          dateInput: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            padding: 10,
          },
          dateText: formStyles.value,
          btnTextConfirm: {
            height: 20,
            color: colors.TEXT_LIGHT,
          },
          btnTextCancel: {
            height: 20,
          },
        }}
        date={value}
        mode="date"
        format="MM/DD/YY"
        placeholder="MM/DD/YY"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        showIcon={false}
        onDateChange={(date) => {
          handleDateChange(key1, date);
        }}
      />
    </View>
  );
};

DateItem.propTypes = {
  label: PropTypes.string.isRequired,
  key1: PropTypes.string.isRequired,
  value: PropTypes.string,
  required: PropTypes.bool.isRequired,
  showWarning: PropTypes.bool.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  showWarningNotification: PropTypes.func.isRequired,
};

DateItem.defaultProps = {
  label: 'N/A',
  value: '',
};

export default DateItem;
