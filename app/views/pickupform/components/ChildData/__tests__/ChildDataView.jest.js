import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import ChildData from '../';

const mockRefCodes = [
  { code: 'z', description: 'Z' },
  { code: 'a', description: 'A' },
  { code: 'c', description: 'C' },
  { code: 'd', description: 'D' },
  { code: 'g', description: 'G' },
  { code: 'w', description: 'W' },
  { code: 'h', description: 'H' },
  { code: 'p', description: 'P' },
  { code: 'f', description: 'F' },
  { code: 'b', description: 'B' },
  { code: 'y', description: 'Y' },
];
const sortedMockCodes = [
  { code: 'a', description: 'A' },
  { code: 'b', description: 'B' },
  { code: 'c', description: 'C' },
  { code: 'd', description: 'D' },
  { code: 'f', description: 'F' },
  { code: 'g', description: 'G' },
  { code: 'h', description: 'H' },
  { code: 'p', description: 'P' },
  { code: 'w', description: 'W' },
  { code: 'y', description: 'Y' },
  { code: 'z', description: 'Z' },
];
const Props = {
  data: mockRefCodes,
  navigator: { setOnNavigatorEvent: jest.fn(), pop: jest.fn() },
  handleOnSelect: jest.fn(),
  multiselect: false,
  key1: 'colors',
  value: '',
  scrollOnSave: false,
};
test('it matches single select snapshot', () => {
  const tree = renderer.create(<ChildData {...Props} />).toJSON();
  expect(tree).toMatchSnapshot();
});
test('it matches multi select snapshot', () => {
  const tree = renderer.create(<ChildData
    {...Props}
    multiselect
  />).toJSON();
  expect(tree).toMatchSnapshot();
});
test('it does not presort the data if the list of data is less than 10', () => {
  const mockCodes = [
    { code: 'z', description: 'Z' },
    { code: 'a', description: 'A' },
    { code: 'c', description: 'C' },
    { code: 'd', description: 'D' },
  ];
  const wrapper = shallow(<ChildData
    {...Props}
    data={mockCodes}
  />);
  expect(wrapper.state('dataSource')).toEqual(mockCodes);
});
test('it sorts the data upon construction if the list of data is 10 or greater', () => {
  const wrapper = shallow(<ChildData
    {...Props}
    data={mockRefCodes}
  />);
  expect(wrapper.state('dataSource')).toEqual(sortedMockCodes);
});
test('it prepares the initial selected values in state', () => {
  const wrapper = shallow(<ChildData
    {...Props}
    value="a"
  />);
  expect(wrapper.state('selected')).toEqual({ a: true });
  const wrapper2 = shallow(<ChildData
    {...Props}
    value="a|c|z"
  />);
  expect(wrapper2.state('selected')).toEqual({ a: true, c: true, z: true });
  const wrapper3 = shallow(<ChildData
    {...Props}
    value=""
  />);
  expect(wrapper3.state('selected')).toEqual({});
});
test('it does not allow you to call handleOnSelect more than once', () => {
  Props.handleOnSelect.mockClear();
  const wrapper = shallow(<ChildData {...Props} />);
  const component = wrapper.instance();
  component.onSelection('a');
  component.onSelection('b');
  component.onNavigatorEvent('clear');
  component.onNavigatorEvent('back');
  component.handleSubmitSelection();
  expect(Props.handleOnSelect.mock.calls).toEqual([['colors', 'a', false]]);
});
describe('single select mode', () => {
  let wrapper;
  let component;
  beforeEach(() => {
    wrapper = shallow(<ChildData
      {...Props}
      multiselect={false}
      value=""
    />);
    component = wrapper.instance();
  });
  describe('selecting an item modifies the components selected value in state', () => {
    test('when nothing was previously selected', () => {
      component.onSelection('a');
      expect(wrapper.state('selected')).toEqual({ a: true });
    });
    test('when it was previously selected', () => {
      wrapper.setState({ selected: { a: true } });
      component.onSelection('a');
      expect(wrapper.state('selected')).toEqual({ a: false });
    });
    test('when something else was previously selected', () => {
      wrapper.setState({ selected: { a: true } });
      component.onSelection('b');
      expect(wrapper.state('selected')).toEqual({ b: true });
    });
  });
});
describe('multi select mode', () => {
  let wrapper;
  let component;
  beforeEach(() => {
    wrapper = shallow(<ChildData
      {...Props}
      multiselect
      value=""
    />);
    component = wrapper.instance();
  });
  describe('selecting an item modifies the components selected value in state', () => {
    test('when nothing was previously selected', () => {
      component.onSelection('a');
      expect(wrapper.state('selected')).toEqual({ a: true });
    });
    test('when it was previously selected', () => {
      wrapper.setState({ selected: { a: true } });
      component.onSelection('a');
      expect(wrapper.state('selected')).toEqual({ a: false });
    });
    test('when something else was previously selected', () => {
      wrapper.setState({ selected: { b: true } });
      component.onSelection('a');
      expect(wrapper.state('selected')).toEqual({ a: true, b: true });
    });
  });
});
test('calling filterData filters the options stored in the state', () => {
  const data = [
    { code: 'a', description: 'apple' },
    { code: 'b', description: 'banana' },
    { code: 'c', description: 'cherry' },
  ];
  const filteredData = [{ code: 'a', description: 'apple' }, { code: 'b', description: 'banana' }];
  const wrapper = shallow(<ChildData
    {...Props}
    data={data}
  />);
  const component = wrapper.instance();
  component.filterData('a');
  expect(wrapper.state('dataSource')).toEqual(filteredData);
});
test('resetting the filter resets the data back to its original value', () => {
  const wrapper = shallow(<ChildData {...Props} />);
  const component = wrapper.instance();
  component.filterData('a');
  component.clearFilter();
  expect(wrapper.state('dataSource')).toEqual(sortedMockCodes);
});
describe('it prepares the selected values before calling handleOnSelect', () => {
  let wrapper;
  let component;
  beforeEach(() => {
    Props.handleOnSelect.mockClear();
    wrapper = shallow(<ChildData {...Props} />);
    component = wrapper.instance();
  });
  test('with none selected', () => {
    wrapper.setState({ selected: {} }, () => {
      component.handleSubmitSelection();
      expect(Props.handleOnSelect.mock.calls).toEqual([['colors', '', false]]);
    });
  });
  test('with one selected true', () => {
    wrapper.setState({ selected: { a: true } }, () => {
      component.handleSubmitSelection();
      expect(Props.handleOnSelect.mock.calls).toEqual([['colors', 'a', false]]);
    });
  });
  test('with one selected false', () => {
    wrapper.setState({ selected: { a: false } }, () => {
      component.handleSubmitSelection();
      expect(Props.handleOnSelect.mock.calls).toEqual([['colors', '', false]]);
    });
  });
  test('with all true', () => {
    wrapper.setState({ selected: { a: true, b: true, z: true } }, () => {
      component.handleSubmitSelection();
      expect(Props.handleOnSelect.mock.calls).toEqual([['colors', 'a|b|z', false]]);
    });
  });
  test('with all false', () => {
    wrapper.setState({ selected: { a: false, b: false, z: false } }, () => {
      component.handleSubmitSelection();
      expect(Props.handleOnSelect.mock.calls).toEqual([['colors', '', false]]);
    });
  });
  test('with a mix of true and false', () => {
    wrapper.setState({ selected: { a: false, b: true, z: false, d: true } }, () => {
      component.handleSubmitSelection();
      expect(Props.handleOnSelect.mock.calls).toEqual([['colors', 'b|d', false]]);
    });
  });
});
