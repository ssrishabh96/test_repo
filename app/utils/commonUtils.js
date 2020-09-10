/* eslint-disable no-console */

import { keys, curry, assoc, reduce, juxt, join, compose, toUpper, head, tail } from 'ramda';
import Locale from 'utils/locale';

export const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)),
);

export const capitalize = (inputString) => {
  if (!inputString) return 'N/A';

  if (inputString.indexOf('_') !== -1) {
    const upperCaseValues = inputString.split('_').map(val => capitalize(val));
    return upperCaseValues.join(' ');
  }

  const upperCase = compose(join(''), juxt([compose(toUpper, head), tail]))(inputString);
  return upperCase;
};

export const ramdaLogger = value => console.log(value);

export const getPropNameForLbl = (data, listType, prop) => {
  let value = Locale.translate('N/A');

  if (data && data[prop]) {
    const createdByNamesArray = data && data[prop] && data[prop].split('-');
    value =
      (createdByNamesArray &&
      Array.isArray(createdByNamesArray) &&
      createdByNamesArray.length > 0 &&
      listType === 'raised'
        ? createdByNamesArray[createdByNamesArray.length - 1]
        : createdByNamesArray[0]) || data[prop];
  }
  return value;
};

export function onlyNumbers(text: ?string): number | string {
  if (typeof text === 'string') {
    const occurences = text.match(/[0-9.]/g) || [];
    const numbersAsString = occurences.join('');
    if (
      numbersAsString.endsWith('.') ||
      numbersAsString.endsWith('0') || // preserve trailing 0
      numbersAsString.endsWith('.0') || // preserve zero after one decimal place
      numbersAsString.endsWith('.00') // preserve trailing 00
    ) {
      return numbersAsString;
    }
    return numbersAsString === '' ? '' : parseFloat(numbersAsString);
  }
  return text || '';
}
