jest.mock('react-native-device-info', () => ({
  getVersion: () => 123,
  getBuildNumber: () => 123,
}));
