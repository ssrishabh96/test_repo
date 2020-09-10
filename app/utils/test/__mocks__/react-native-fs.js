jest.mock('react-native-fs', () => ({
  unlink: jest.fn().mockImplementation(() => Promise.resolve({})),
}));
