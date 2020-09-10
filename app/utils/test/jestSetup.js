import './__mocks__/react-native-device-info';
import './__mocks__/react-native-firebase';
import './__mocks__/react-native-code-push';
import './__mocks__/react-native-fs';
import './__mocks__/react-native-camera';
import './__mocks__/react-native-navigation';
import './__mocks__/react-native-image-picker';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const mockAxios = jest.fn(() => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock('services/xhr', () => ({
  transporterApi: mockAxios,
  authApi: mockAxios,
}));

// global.btoa = jest.fn(() => {});
global.Date.now = jest.fn(() => 1487076708000); // 14.02.2017
