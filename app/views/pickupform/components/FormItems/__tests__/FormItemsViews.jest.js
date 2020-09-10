import React from 'react';
import { shallow } from 'enzyme';

import AccessoryItem from '../accessoryItem';
import ButtonItem from '../buttonsItem';
import CommentsItem from '../commentsItem';
import DateItem from '../dateItem';
import ImageItem from '../imageItem';
import LabelItem from '../labelItem';
import MultiImage from '../multiImageItem';
import SignatureItem from '../signatureItem';
import TextItem from '../textItem';
import VinItem from '../vinItem';
import { RoundButton } from '../styles';
import referenceCodes from 'utils/mappers/referenceCodes';

describe('the accessory item', () => {
  const accessoryProps = {
    label: 'Label',
    value: '',
    required: true,
    showWarning: false,
    referenceDataKey: 'colors',
    key1: 'colors',
    multiselect: false,
    openPicker: jest.fn(),
    referenceCodes,
    showWarningNotification: jest.fn(),
    scrollOnSave: false,
  };
  test('it renders empty value', () => {
    const wrapper = shallow(<AccessoryItem {...accessoryProps} />);
    expect(wrapper).toMatchSnapshot();
  });
  test('it renders with color', () => {
    const customProps = {
      value: 'RED',
      referenceDataKey: 'colors',
      key1: 'colors',
    };
    const wrapper = shallow(<AccessoryItem
      {...accessoryProps}
      {...customProps}
    />);
    expect(wrapper).toMatchSnapshot();
  });
  test('it renders with multiple descriptions', () => {
    const customProps = {
      value: 'Battery|Engine',
      referenceDataKey: 'mechanicalPartCodes',
      key1: 'mechanical',
    };
    const wrapper = shallow(<AccessoryItem
      {...accessoryProps}
      {...customProps}
    />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains('Battery, Engine')).toBe(true);
  });
  test('if the description is over 30 characters, it cuts it off at 30 and appends an elipses', () => {
    const customProps = {
      value: 'Battery|Engine|Radiator|Transmission',
      referenceDataKey: 'mechanicalPartCodes',
      key1: 'mechanical',
    };
    const wrapper = shallow(<AccessoryItem
      {...accessoryProps}
      {...customProps}
    />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains('Battery, Engine, Radiator, Tra...')).toBe(true);
  });
});
describe('the buttons items', () => {
  const buttonProps = {
    label: '',
    required: true,
    showWarning: false,
    optionKeys: 'A|B|C',
    optionValues: 'a|b|c',
    key1: 'key1',
    currentPickupLot: {
      key1: 'b',
    },
    handleOnSelect: jest.fn(),
    showWarningNotification: jest.fn(),
  };
  test('it matches the snapshot', () => {
    const wrapper = shallow(<ButtonItem {...buttonProps} />);
    expect(wrapper).toMatchSnapshot();
  });
  test('it renders a button for each option', () => {
    const wrapper = shallow(<ButtonItem {...buttonProps} />);
    expect(wrapper.find(RoundButton).length).toBe(3);
  });
});
describe('the comments items', () => {
  const commentProps = {
    key1: 'key1',
    label: 'label',
    value: '',
    required: true,
    showWarning: false,
    handleOnSelect: jest.fn(() => null),
    showWarningNotification: jest.fn(),
    validations: {
      maxLength: 5,
    },
  };
  beforeEach(() => {
    commentProps.handleOnSelect.mockClear();
  });
  test('matches the snapshot', () => {
    const wrapper = shallow(<CommentsItem {...commentProps} />);
    expect(wrapper).toMatchSnapshot();
  });
  test('on text change it calls handleOnSelect with the input', () => {
    const wrapper = shallow(<CommentsItem {...commentProps} />);
    wrapper.find('TextInput').simulate('ChangeText', 'abc');
    expect(commentProps.handleOnSelect.mock.calls).toEqual([['key1', 'abc']]);
  });
  test('if the change does not pass the maximum length validation, it does not call handleOnSelect', () => {
    const wrapper = shallow(<CommentsItem {...commentProps} />);
    const textInput = wrapper.find('TextInput');

    textInput.simulate('ChangeText', '12345');
    expect(commentProps.handleOnSelect.mock.calls.length).toBe(1);

    textInput.simulate('ChangeText', '123456');
    expect(commentProps.handleOnSelect.mock.calls.length).toBe(1);
  });
});
describe('the date item', () => {
  const dateProps = {
    key1: 'key1',
    label: 'label',
    value: '01/01/2018',
    required: false,
    showWarning: false,
    handleDateChange: jest.fn(),
    showWarningNotification: jest.fn(),
  };
  test('matches the snapshot', () => {
    const wrapper = shallow(<DateItem {...dateProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
describe('the image item', () => {
  const imageProps = {
    key1: 'key1',
    label: 'label',
    value: {},
    required: true,
    showWarning: false,
    showWarningNotification: jest.fn(),
    openCamera: jest.fn(),
    handleOnSelect: jest.fn(),
    type: 'image',
    handlePreviewClick: jest.fn(),
    documentType: 'ADVANCE_CHARGES_REVIEW',
  };
  test('matches the snapshot when no value is set', () => {
    const wrapper = shallow(<ImageItem {...imageProps} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains('Tap to take picture')).toBe(true);
  });
  test('matches the snapshot when value is set', () => {
    const wrapper = shallow(<ImageItem
      {...imageProps}
      value={{ pathName: 'path/to/image' }}
    />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.contains('Tap to take picture')).toBe(false);
  });
});
describe('the label item', () => {
  const labelprops = {
    label: 'Label',
    key1: 'key1',
    format: undefined,
    currentPickupLot: { key1: 'value' },
  };
  test('matches the snapshot', () => {
    const wrapper = shallow(<LabelItem {...labelprops} />);
    expect(wrapper).toMatchSnapshot();
  });
  test('formats currency', () => {
    const wrapper = shallow(
      <LabelItem
        {...labelprops}
        format="currency"
        currentPickupLot={{ key1: '110' }}
      />,
    );
    expect(wrapper.contains('$110.00')).toBe(true);
  });
  test('formats dates', () => {
    const wrapper = shallow(
      <LabelItem
        {...labelprops}
        format="date"
        currentPickupLot={{ key1: '2018-12-25' }}
      />,
    );
    expect(wrapper.contains('12/25/2018')).toBe(true);
  });
});
describe('the multiImage Item', () => {
  const multiProps = {
    key1: 'key1',
    label: 'label',
    value: [],
    required: false,
    showWarning: false,
    showWarningNotification: jest.fn(),
    openCamera: jest.fn(),
    handleOnSelect: jest.fn(),
    type: 'multiImage',
    handlePreviewClick: jest.fn(),
    documentType: 'ADVANCE_CHARGES_REVIEW',
  };
  test('it matches the snapshot with no value', () => {
    const wrapper = shallow(<MultiImage {...multiProps} />);
    expect(wrapper).toMatchSnapshot();
  });
  test('it matches the snapshot with values', () => {
    const wrapper = shallow(
      <MultiImage
        {...multiProps}
        value={[{ image: { pathName: 'path/name.jpg' } }]}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
describe('the signature item', () => {
  const signatureProps = {
    key1: 'key1',
    label: 'label',
    value: undefined,
    required: false,
    showWarning: false,
    showSignatureView: jest.fn(),
    showWarningNotification: jest.fn(),
  };
  test('it matches the snapshot with no value', () => {
    const wrapper = shallow(<SignatureItem {...signatureProps} />);
    expect(wrapper).toMatchSnapshot();
  });
  test('it matches the snapshot with a value', () => {
    const wrapper = shallow(<SignatureItem
      {...signatureProps}
      value={{ encoded: '00000000' }}
    />);
    expect(wrapper).toMatchSnapshot();
  });
});
describe('the text item', () => {
  const textprops = {
    key1: 'key1',
    label: 'label',
    value: '',
    required: false,
    validations: {},
    keyboardType: 'default',
    isCurrency: false,
    showWarning: false,
    handleOnSelect: jest.fn(),
    showWarningNotification: jest.fn(),
    autoCapitalize: 'none',
  };
  beforeEach(() => {
    textprops.handleOnSelect.mockClear();
  });
  test('it matches the snapshot when isCurrency is false', () => {
    const wrapper = shallow(<TextItem
      {...textprops}
      isCurrency={false}
    />);
    expect(wrapper).toMatchSnapshot();
  });
  test('it matches the snapshot when isCurrency is true', () => {
    const wrapper = shallow(<TextItem
      {...textprops}
      isCurrency
    />);
    expect(wrapper).toMatchSnapshot();
  });
  test('it calls handleOnSelect when the textInput value changes', () => {
    const wrapper = shallow(<TextItem {...textprops} />);
    wrapper.find('TextInput').simulate('ChangeText', 'ABC');
    expect(textprops.handleOnSelect.mock.calls).toEqual([['key1', 'ABC']]);
  });
  describe('it does not call handleOnSelect if', () => {
    test('it does not pass the currency validation', () => {
      const wrapper = shallow(<TextItem
        {...textprops}
        validations={{ match: 'currency' }}
      />);
      wrapper.find('TextInput').simulate('ChangeText', 'ABC');
      expect(textprops.handleOnSelect.mock.calls.length).toBe(0);
      wrapper.find('TextInput').simulate('ChangeText', '1.001');
      expect(textprops.handleOnSelect.mock.calls.length).toBe(0);
    });
    test('it does not pass the numeric validation', () => {
      const wrapper = shallow(<TextItem
        {...textprops}
        validations={{ match: 'numeric' }}
      />);
      wrapper.find('TextInput').simulate('ChangeText', 'ABC');
      expect(textprops.handleOnSelect.mock.calls.length).toBe(0);
      wrapper.find('TextInput').simulate('ChangeText', '1A');
      expect(textprops.handleOnSelect.mock.calls.length).toBe(0);
    });
    test('it does not pass the max length validation', () => {
      const wrapper = shallow(<TextItem
        {...textprops}
        validations={{ maxLength: 5 }}
      />);
      wrapper.find('TextInput').simulate('ChangeText', '123456');
      expect(textprops.handleOnSelect.mock.calls.length).toBe(0);
    });
  });
  describe('it does call handleOnSelect if', () => {
    test('it does pass the currency validation', () => {
      const wrapper = shallow(<TextItem
        {...textprops}
        validations={{ match: 'currency' }}
      />);
      wrapper.find('TextInput').simulate('ChangeText', '');
      expect(textprops.handleOnSelect.mock.calls.length).toBe(1);
      wrapper.find('TextInput').simulate('ChangeText', '1');
      expect(textprops.handleOnSelect.mock.calls.length).toBe(2);
      wrapper.find('TextInput').simulate('ChangeText', '0.0');
      expect(textprops.handleOnSelect.mock.calls.length).toBe(3);
      wrapper.find('TextInput').simulate('ChangeText', '0.01');
      expect(textprops.handleOnSelect.mock.calls.length).toBe(4);
    });
    test('it does pass the numeric validation', () => {
      const wrapper = shallow(<TextItem
        {...textprops}
        validations={{ match: 'numeric' }}
      />);
      wrapper.find('TextInput').simulate('ChangeText', '123');
      expect(textprops.handleOnSelect.mock.calls.length).toBe(1);
    });
    test('it does pass the max length validation', () => {
      const wrapper = shallow(<TextItem
        {...textprops}
        validations={{ maxLength: 5 }}
      />);
      wrapper.find('TextInput').simulate('ChangeText', '12345');
      expect(textprops.handleOnSelect.mock.calls.length).toBe(1);
    });
  });
});
describe('the vin item', () => {
  const vinProps = {
    key1: 'key1',
    label: 'label',
    value: '',
    required: false,
    showWarning: false,
    handleOnSelect: jest.fn(),
    showWarningNotification: jest.fn(),
    showScannerView: jest.fn(),
  };
  test('it matches the snapshot', () => {
    const wrapper = shallow(<VinItem {...vinProps} />);
    expect(wrapper).toMatchSnapshot();
  });
  test('it calls handleOnSelect when the textInput value changes', () => {
    const wrapper = shallow(<VinItem {...vinProps} />);
    wrapper.find('TextInput').simulate('ChangeText', '12345');
    expect(vinProps.handleOnSelect.mock.calls).toEqual([['key1', '12345']]);
  });
});
