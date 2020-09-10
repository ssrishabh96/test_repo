import { onlyNumbers } from 'utils/commonUtils';

describe('function onlyNumbers', () => {
  test('should format input properly', () => {
    const ip1 = '$3';
    const ip2 = '$3.99';
    const ip3 = '$0.99';
    const ip4 = '$';
    const ip5 = 123;
    const ip6 = null;
    const ip7 = undefined;
    const ip8 = NaN;

    expect(onlyNumbers(ip1)).toEqual(3);
    expect(onlyNumbers(ip2)).toEqual(3.99);
    expect(onlyNumbers(ip3)).toEqual(0.99);
    expect(onlyNumbers(ip4)).toEqual('');
    expect(onlyNumbers(ip5)).toEqual(123);
    expect(onlyNumbers(ip6)).toEqual('');
    expect(onlyNumbers(ip7)).toEqual('');
    expect(onlyNumbers(ip8)).toEqual('');
  });

  test('should remove any other characters expect numbers and decimal point', () => {
    const ip1 = '$3.'; // preserve decimal
    const ip2 = '$3.50a'; // remove any extra characters
    const ip3 = 'a'; // only numbers

    expect(onlyNumbers(ip1)).toEqual('3.');
    expect(onlyNumbers(ip2)).toEqual('3.50');
    expect(onlyNumbers(ip3)).toEqual('');
  });

  test('should remove commas from inputs to calculate values in thousands/millions', () => {
    const ip1 = '$1,230.99'; // preserve comma and decimal

    expect(onlyNumbers(ip1)).toEqual(1230.99);
  });
});
