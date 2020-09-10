import { formatPhoneNumber, mergePageIntoList } from '../index';

describe('Utils tests', () => {
  test('Formats phone number correctly', () => {
    const inputPhoneNumber = '6464312289';
    const outputPhoneNumber = formatPhoneNumber(inputPhoneNumber);
    const expectedOutput = '(646) 431 2289';
    const defaultReturn = 'N/A';
    const phoneNumberLessThanTenDigits = '646431';

    expect(outputPhoneNumber).toEqual(expectedOutput);
    expect(outputPhoneNumber.replace(/[^\d]/g, '')).toEqual(inputPhoneNumber);
    expect(outputPhoneNumber.replace(/[^\d]/g, '')).toHaveLength(10);
    expect(formatPhoneNumber(null)).toEqual(defaultReturn);
    expect(formatPhoneNumber(undefined)).toEqual(defaultReturn);
    expect(formatPhoneNumber(phoneNumberLessThanTenDigits)).toEqual(phoneNumberLessThanTenDigits);
  });
  describe('mergePageIntoList', () => {
    test('should work if existing is empty and new page has items', () => {
      const list = [];
      const newPage = [1, 2, 3, 4, 5];
      const page = 1;
      const pageSize = 5;
      const expectedOutput = [1, 2, 3, 4, 5];
      expect(mergePageIntoList(list, newPage, page, pageSize)).toEqual(expectedOutput);
    });
    test('should work if existing is empty and new page is empty', () => {
      const list = [];
      const newPage = [];
      const page = 1;
      const pageSize = 5;
      const expectedOutput = [];
      expect(mergePageIntoList(list, newPage, page, pageSize)).toEqual(expectedOutput);
    });
    test('should work if existing has items and new page is empty', () => {
      const list = [1, 2, 3, 4, 5];
      const newPage = [];
      const page = 1;
      const pageSize = 5;
      const expectedOutput = [];
      expect(mergePageIntoList(list, newPage, page, pageSize)).toEqual(expectedOutput);
    });
    test('should work if it is the next page', () => {
      const list = [1, 2, 3, 4, 5];
      const newPage = [6, 7, 8, 9];
      const page = 2;
      const pageSize = 5;
      const expectedOutput = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(mergePageIntoList(list, newPage, page, pageSize)).toEqual(expectedOutput);
    });
    test('should work if it is replaceing the first page', () => {
      const list = [1, 2, 3, 4, 5];
      const newPage = [6, 7, 8, 9];
      const page = 1;
      const pageSize = 5;
      const expectedOutput = [6, 7, 8, 9];
      expect(mergePageIntoList(list, newPage, page, pageSize)).toEqual(expectedOutput);
    });
    test('should work if it is replaceing the last page', () => {
      const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      const newPage = ['a', 'b', 'c', 'd', 'e'];
      const page = 2;
      const pageSize = 5;
      const expectedOutput = [1, 2, 3, 4, 5, 'a', 'b', 'c', 'd', 'e'];
      expect(mergePageIntoList(list, newPage, page, pageSize)).toEqual(expectedOutput);
    });
    test('should work if it is replaceing a middle page', () => {
      const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      const newPage = ['a', 'b', 'c', 'd', 'e'];
      const page = 2;
      const pageSize = 5;
      const expectedOutput = [1, 2, 3, 4, 5, 'a', 'b', 'c', 'd', 'e', 11, 12, 13, 14, 15];
      expect(mergePageIntoList(list, newPage, page, pageSize)).toEqual(expectedOutput);
    });
  });
});
