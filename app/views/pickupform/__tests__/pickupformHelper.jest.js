import * as helpers from '../pickupform.helper';
import referenceCodes from 'utils/mappers/referenceCodes';

describe('mapMultiCodes', () => {
  test('works when value is undefined', () => {
    const value = undefined;
    const result = helpers.mapMultiCodes(referenceCodes.exteriorPartCodes, value);
    expect(result).toEqual({
      'Bumper Cover': false,
      Headlamps: false,
      Taillamps: false,
      Tailgate: false,
    });
  });
  test('works when value is \'\'', () => {
    const value = '';
    const result = helpers.mapMultiCodes(referenceCodes.exteriorPartCodes, value);
    expect(result).toEqual({
      'Bumper Cover': false,
      Headlamps: false,
      Taillamps: false,
      Tailgate: false,
    });
  });
  test('works when one value is selected', () => {
    const value = 'Headlamps';
    const result = helpers.mapMultiCodes(referenceCodes.exteriorPartCodes, value);
    expect(result).toEqual({
      'Bumper Cover': false,
      Headlamps: true,
      Taillamps: false,
      Tailgate: false,
    });
  });
  test('works when multiple values are selected', () => {
    const value = 'Headlamps|Tailgate|Taillamps';
    const result = helpers.mapMultiCodes(referenceCodes.exteriorPartCodes, value);
    expect(result).toEqual({
      'Bumper Cover': false,
      Headlamps: true,
      Taillamps: true,
      Tailgate: true,
    });
  });
});

describe('getDescriptionFromCode', () => {
  test('returns \'\' when undefined', () => {
    const result = helpers.getDescriptionFromCode(referenceCodes.colors, undefined);
    expect(result).toEqual('');
  });
  test('returns \'\' when \'\'', () => {
    const result = helpers.getDescriptionFromCode(referenceCodes.colors, '');
    expect(result).toEqual('');
  });
  test('returns the correct description', () => {
    const result = helpers.getDescriptionFromCode(referenceCodes.colors, '2TONE');
    expect(result).toEqual('TWO TONE');
  });
});
