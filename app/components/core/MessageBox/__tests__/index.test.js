import React from 'react';
import { shallow } from 'enzyme';
import MessageBox from '../MessageBox';

describe('Testing MessageBox component', () => {
  test('Renders with success type', () => {
    const wrapper = shallow(<MessageBox
      type={'success'}
      message="Success Message"
    />);
    // console.log(wrapper.props().children.props);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.prop('type')).toEqual('success');
    expect(wrapper.props().children.props.children).toBe('Success Message');
  });
  test('Renders with error type', () => {
    const wrapper = shallow(<MessageBox
      type={'error'}
      message="Error Message"
    />);
    // console.log(wrapper.props().children.props);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.prop('type')).toEqual('error');
    expect(wrapper.props().children.props.children).toBe('Error Message');
  });
  test('Renders with default props', () => {
    const wrapper = shallow(<MessageBox message="Info Message" />);
    expect(wrapper.prop.arguments).toBeNull();
    expect(wrapper.exists('<Text>Info Message</Text>')).toBeTruthy();
  });
});
