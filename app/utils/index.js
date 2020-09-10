// @flow
import { slice } from 'ramda';
/**
 * @description Phone number formatter. This either returns the formatted phonenumber
 * if it can or returns the default input N/A if the parameter was not "string". Also,
 * if the input is string and the length is not 10 digits exactly, the function will return
 * whatever input was passed to it i.e., an unformatted string.
 * @param {string} number Phone number of 10 digits length
 * @returns (123) 456 789
 */
export const formatPhoneNumber = (number: string): string => {
  if (typeof number !== 'string') {
    return 'N/A';
  }
  if (
    typeof number === 'string' &&
    (number.length !== 10 || number.length > 10 || number.length <= 0)
  ) {
    return number;
  }

  if (typeof number === 'string' && number.length === 10) {
    const phoneNumber = `(${number.substring(0, 3)}) ${number.substring(3, 6)} ${number.substring(
      6,
    )}`;
    return phoneNumber;
  }
  return number;
};

/**
 * @description slices the new page into the existing list at pageSize*pageNumber index. replaceing what was previously there.
 * This is used for pagination, so that if a page is requested twice, it will replace the page in the list rather than appending again and creating duplicates
 * @param {Array<any>} existingList - the existing list of data to merge the page into.
 * @param {Array<any>} newPage - the list being merged into the existing list
 * @param {number} pageNumber - the page number of the data.
 * @param {number} pageSize - how many list items in a full page.
 */
export function mergePageIntoList(
  existingList: Array<any>,
  newPage: Array<any>,
  pageNumber: number,
  pageSize: number,
): Array<any> {
  const sliceLessThanPage = slice(0, (pageNumber - 1) * pageSize);
  const sliceGreaterThanPage = slice(pageNumber * pageSize, Infinity);
  const mergedList = sliceLessThanPage(existingList).concat(
    newPage,
    sliceGreaterThanPage(existingList),
  );
  return mergedList;
}
