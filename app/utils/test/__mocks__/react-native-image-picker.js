jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
}));
