import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Filter from '../filter.view';

import { getFacetCount } from 'views/trips/trips.service';
import * as helpers from '../filter.helpers';

jest.mock('views/trips/trips.service', () => ({
  getFacetCount: jest.fn(),
}));
getFacetCount.mockImplementation(() =>
  Promise.resolve({
    status: 'success',
    data: {
      damage_type_code: ['UK', 119, 'AO', 26, 'FR', 3],
      issues: ['No', 145, 'Yes', 3],
      location_city: [
        'LOVELAND',
        65,
        'DEER TRAIL',
        54,
        'DENVER',
        18,
        'WEATHERFORD',
        4,
        'GREENWOOD VILLAGE',
        2,
        'BELOIT',
        1,
        'FORT WORTH',
        1,
        'GRAND JUNCTION',
        1,
        'OKOLONA',
        1,
        'PUEBLO',
        1,
      ],
      payment_mode: ['CARD/CHECK', 117, 'CASH', 20, '', 11],
      towable_flag: ['Yes', 112, 'No', 34, 'Unknown', 2],
      trip_type_code: ['P', 144, 'D', 2, 'T', 2],
    },
  }),
);

const Props = {
  applyFilter: jest.fn(),
  bucket: 'bucket',
  selectedFilters: {},
  totalCount: 0,
  closeFilters: jest.fn(),
  isVisible: true,
  navigator: {
    showInAppNotification: jest.fn(),
  },
};
test('get facet count is only called when isVisible changes from false to true', () => {
  getFacetCount.mockImplementation(() =>
    Promise.resolve({
      status: 'success',
      data: {},
    }),
  );
  const component = shallow(<Filter {...{ ...Props, isVisible: false }} />);
  expect(getFacetCount.mock.calls.length).toEqual(0);
  component.setProps({ isVisible: true });
  expect(getFacetCount.mock.calls.length).toEqual(1);
  component.setProps({ isVisible: true });
  expect(getFacetCount.mock.calls.length).toEqual(1);
  component.setProps({ isVisible: false });
  expect(getFacetCount.mock.calls.length).toEqual(1);
});

test('the view renders correctly', () => {
  const tree = renderer.create(<Filter {...Props} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('prepare data works', () => {
  const data = {
    active_issue_flag: ['No', 145, 'Yes', 3],
    trip_type_code: ['P', 144, 'D', 2, 'T', 2],
  };
  const expectedResult = [
    {
      field: 'active_issue_flag',
      label: 'Has Active Issue',
      values: [
        {
          code: 'No',
          count: 145,
          description: 'No',
        },
        {
          code: 'Yes',
          count: 3,
          description: 'Yes',
        },
      ],
    },
    {
      field: 'trip_type_code',
      label: 'Trip Type',
      values: [
        {
          code: 'P',
          count: 144,
          description: 'P',
        },
        {
          code: 'D',
          count: 2,
          description: 'D',
        },
        {
          code: 'T',
          count: 2,
          description: 'T',
        },
      ],
    },
  ];
  expect(helpers.prepareData(data)).toEqual(expectedResult);
});
