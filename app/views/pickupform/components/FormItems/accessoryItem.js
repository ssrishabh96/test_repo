import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import renderIf from 'render-if';
import { propEq, find } from 'ramda';
import colors from '../../../../styles/colors';
import { formStyles } from './styles';
import { Required, Warning } from './flags';
import Locale from 'utils/locale';

function getDescriptionFromCode(referenceCodes, referenceDataKey, values) {
  if (!values) return { description: [''], hexcode: undefined };
  const codes = referenceCodes[referenceDataKey];

  return values.split('|').reduce(
    (acc, next) => {
      const i = find(propEq('code', next), codes);
      if (!i) return acc;
      acc.description.push(i.description);
      if (i.hexcode) acc.hexcode = i.hexcode;
      return acc;
    },
    { hexcode: undefined, description: [] },
  );
}

const AccessoryItem = ({
  /* id, */
  label,
  value,
  required,
  showWarning,
  referenceDataKey,
  key1,
  multiselect,
  openPicker,
  referenceCodes,
  showWarningNotification,
  sortable,
  scrollOnSave,
}) => {
  const { hexcode, description } = getDescriptionFromCode(referenceCodes, referenceDataKey, value);
  let descriptionText = description.join(', ');
  if (descriptionText.length > 30) {
    descriptionText = `${descriptionText.substring(0, 30)}...`;
  }
  const renderIfIsRequired = renderIf(required);

  return (
    <TouchableHighlight
      onPress={() =>
        openPicker(
          label,
          referenceCodes[referenceDataKey],
          key1,
          required,
          multiselect,
          sortable,
          scrollOnSave,
        )
      }
      underlayColor="#EBEBEB"
    >
      <View style={styles.row}>
        <View style={styles.labelDescWrapper}>
          <View style={styles.labelWrap}>
            {showWarning && <Warning onPress={() => showWarningNotification({ label })} />}
            <Text style={formStyles.label}>
              {label}
              {renderIfIsRequired(<Required />)}
            </Text>
          </View>
          <View style={styles.descWrap}>
            {hexcode !== undefined && (
              <View
                style={[
                  styles.colorBox,
                  {
                    marginTop: Platform.OS === 'ios' ? -4 : 0,
                    backgroundColor: hexcode,
                    borderColor: hexcode === '#FFFFFF' ? 'black' : hexcode,
                  },
                ]}
              />
            )}
            <Text style={[formStyles.value, styles.description]}>
              {descriptionText !== ''
                ? descriptionText
                : Locale.translate('PickupForm.PleaseSelect')}
            </Text>
          </View>
        </View>
        <Icon
          size={22}
          name={'angle-right'}
          color={colors.TEXT_DARK}
          style={{ paddingRight: 5 }}
        />
      </View>
    </TouchableHighlight>
  );
};
const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    borderColor: '#EBEBEB',
    borderBottomWidth: 1,
    paddingTop: 18,
    paddingRight: 10,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  labelWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 2,
  },
  descWrap: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' },
  colorBox: {
    marginRight: 10,
    width: 50,
    height: 30,
    borderRadius: 8,
    borderWidth: 2,
  },
  description: {
    // flex: 1,
    paddingTop: 2,
    paddingRight: 10,
    textAlign: 'right',
  },
  labelDescWrapper: {
    flex: 1,
    minHeight: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
AccessoryItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  multiselect: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
  showWarning: PropTypes.bool.isRequired,
  referenceDataKey: PropTypes.string.isRequired,
  key1: PropTypes.string.isRequired,
  openPicker: PropTypes.func.isRequired,
  sortable: PropTypes.bool.isRequired,
  referenceCodes: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)))
    .isRequired,
  showWarningNotification: PropTypes.func.isRequired,
};

AccessoryItem.defaultProps = {
  label: 'N/A',
  value: '',
};

export default AccessoryItem;
