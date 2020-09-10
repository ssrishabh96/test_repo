import { prepareParams2 } from '../lotlist.helper';
import { bucketToStatusMap } from 'constants/Lot';
import moment from 'moment';

describe('Helper tests', () => {
  describe('prepareParams2', () => {
    describe('for assigned', () => {
      const bucket = 'assigned';
      test('with no filter/search/sort', () => {
        const sort = {};
        const search = {};
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters', () => {
        const sort = {};
        const search = {};
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket], make: ['HONDA', 'TOYOTA'] },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with sort', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = {};
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          sort_by: { lotNum: 'asc' },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with search', () => {
        const sort = {};
        const search = { search: '123' };
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and sort', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = {};
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket], make: ['HONDA', 'TOYOTA'] },
          sort_by: { lotNum: 'asc' },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and search', () => {
        const sort = {};
        const search = { search: '123' };
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with sort and search', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = { search: '123' };
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and sort and search', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = { search: '123' };
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
    });
    describe('for accepted', () => {
      const bucket = 'accepted';
      test('with no filter/search/sort', () => {
        const sort = {};
        const search = {};
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters', () => {
        const sort = {};
        const search = {};
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket], make: ['HONDA', 'TOYOTA'] },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with sort', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = {};
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          sort_by: { lotNum: 'asc' },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with search', () => {
        const sort = {};
        const search = { search: '123' };
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and sort', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = {};
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket], make: ['HONDA', 'TOYOTA'] },
          sort_by: { lotNum: 'asc' },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and search', () => {
        const sort = {};
        const search = { search: '123' };
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with sort and search', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = { search: '123' };
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and sort and search', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = { search: '123' };
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
    });
    describe('for inProgress', () => {
      const bucket = 'inProgress';
      test('with no filter/search/sort', () => {
        const sort = {};
        const search = {};
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters', () => {
        const sort = {};
        const search = {};
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket], make: ['HONDA', 'TOYOTA'] },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with sort', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = {};
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          sort_by: { lotNum: 'asc' },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with search', () => {
        const sort = {};
        const search = { search: '123' };
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and sort', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = {};
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket], make: ['HONDA', 'TOYOTA'] },
          sort_by: { lotNum: 'asc' },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and search', () => {
        const sort = {};
        const search = { search: '123' };
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with sort and search', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = { search: '123' };
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and sort and search', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = { search: '123' };
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
    });
    describe('for inTransit', () => {
      const bucket = 'inTransit';
      test('with no filter/search/sort', () => {
        const sort = {};
        const search = {};
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters', () => {
        const sort = {};
        const search = {};
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket], make: ['HONDA', 'TOYOTA'] },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with sort', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = {};
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          sort_by: { lotNum: 'asc' },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with search', () => {
        const sort = {};
        const search = { search: '123' };
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and sort', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = {};
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket], make: ['HONDA', 'TOYOTA'] },
          sort_by: { lotNum: 'asc' },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and search', () => {
        const sort = {};
        const search = { search: '123' };
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with sort and search', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = { search: '123' };
        const filter = undefined;
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and sort and search', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = { search: '123' };
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { dispatch_status: bucketToStatusMap[bucket] },
          search: '123',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
    });
    describe('for completed', () => {
      const bucket = 'completed';
      test('with no filter/search/sort', () => {
        const sort = {};
        const search = {};
        const filter = undefined;
        const expectedResult = {
          filter_by: {
            dispatch_status: bucketToStatusMap[bucket],
            completed_date: {
              gte: moment()
                .subtract(7, 'days')
                .format('YYYY-MM-DD'),
              lte: moment()
                .add(1, 'days')
                .format('YYYY-MM-DD'),
            },
            status: ['I', 'A'],
          },
          skip_pagination: true,
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters', () => {
        const sort = {};
        const search = {};
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: {
            dispatch_status: bucketToStatusMap[bucket],
            make: ['HONDA', 'TOYOTA'],
            completed_date: {
              gte: moment()
                .subtract(7, 'days')
                .format('YYYY-MM-DD'),
              lte: moment()
                .add(1, 'days')
                .format('YYYY-MM-DD'),
            },
            status: ['I', 'A'],
          },
          skip_pagination: true,
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with sort', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = {};
        const filter = undefined;
        const expectedResult = {
          filter_by: {
            dispatch_status: bucketToStatusMap[bucket],
            completed_date: {
              gte: moment()
                .subtract(7, 'days')
                .format('YYYY-MM-DD'),
              lte: moment()
                .add(1, 'days')
                .format('YYYY-MM-DD'),
            },
            status: ['I', 'A'],
          },
          skip_pagination: true,
          sort_by: { lotNum: 'asc' },
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with search', () => {
        const sort = {};
        const search = { search: '123' };
        const filter = undefined;
        const expectedResult = {
          filter_by: {
            dispatch_status: bucketToStatusMap[bucket],
            completed_date: {
              gte: moment()
                .subtract(7, 'days')
                .format('YYYY-MM-DD'),
              lte: moment()
                .add(1, 'days')
                .format('YYYY-MM-DD'),
            },
            status: ['I', 'A'],
          },
          search: '123',
          skip_pagination: true,
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and sort', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = {};
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: {
            dispatch_status: bucketToStatusMap[bucket],
            make: ['HONDA', 'TOYOTA'],
            completed_date: {
              gte: moment()
                .subtract(7, 'days')
                .format('YYYY-MM-DD'),
              lte: moment()
                .add(1, 'days')
                .format('YYYY-MM-DD'),
            },
            status: ['I', 'A'],
          },
          sort_by: { lotNum: 'asc' },
          skip_pagination: true,
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and search', () => {
        const sort = {};
        const search = { search: '123' };
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: {
            dispatch_status: bucketToStatusMap[bucket],
            completed_date: {
              gte: moment()
                .subtract(7, 'days')
                .format('YYYY-MM-DD'),
              lte: moment()
                .add(1, 'days')
                .format('YYYY-MM-DD'),
            },
            status: ['I', 'A'],
          },
          search: '123',
          skip_pagination: true,
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with sort and search', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = { search: '123' };
        const filter = undefined;
        const expectedResult = {
          filter_by: {
            dispatch_status: bucketToStatusMap[bucket],
            completed_date: {
              gte: moment()
                .subtract(7, 'days')
                .format('YYYY-MM-DD'),
              lte: moment()
                .add(1, 'days')
                .format('YYYY-MM-DD'),
            },
            status: ['I', 'A'],
          },
          search: '123',
          skip_pagination: true,
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and sort and search', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = { search: '123' };
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: {
            dispatch_status: bucketToStatusMap[bucket],
            completed_date: {
              gte: moment()
                .subtract(7, 'days')
                .format('YYYY-MM-DD'),
              lte: moment()
                .add(1, 'days')
                .format('YYYY-MM-DD'),
            },
            status: ['I', 'A'],
          },
          search: '123',
          skip_pagination: true,
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
    });
    describe('for distributed', () => {
      const bucket = 'distributed';
      test('with no filter/search/sort', () => {
        const sort = {};
        const search = {};
        const filter = undefined;
        const expectedResult = {
          view: 'oversight',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters', () => {
        const sort = {};
        const search = {};
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { make: ['HONDA', 'TOYOTA'] },
          view: 'oversight',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with sort', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = {};
        const filter = undefined;
        const expectedResult = {
          sort_by: { lotNum: 'asc' },
          view: 'oversight',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with search', () => {
        const sort = {};
        const search = { search: '123' };
        const filter = undefined;
        const expectedResult = {
          search: '123',
          view: 'oversight',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and sort', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = {};
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          filter_by: { make: ['HONDA', 'TOYOTA'] },
          sort_by: { lotNum: 'asc' },
          view: 'oversight',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and search', () => {
        const sort = {};
        const search = { search: '123' };
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          search: '123',
          view: 'oversight',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with sort and search', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = { search: '123' };
        const filter = undefined;
        const expectedResult = {
          search: '123',
          view: 'oversight',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
      test('with filters and sort and search', () => {
        const sort = { sort_by: { lotNum: 'asc' } };
        const search = { search: '123' };
        const filter = { make: ['HONDA', 'TOYOTA'] };
        const expectedResult = {
          search: '123',
          view: 'oversight',
        };
        const result = prepareParams2({ bucket, sort, search, filter });
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
