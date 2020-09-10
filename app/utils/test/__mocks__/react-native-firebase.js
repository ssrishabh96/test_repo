jest.mock('react-native-firebase', () => ({
  messaging: jest.fn(() => ({
    requestPermissions: jest.fn(),
    getToken: jest.fn(),
    onMessage: jest.fn(),
  })),
}));
