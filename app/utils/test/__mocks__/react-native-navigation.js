jest.mock('react-native-navigation', () => ({
  Navigation: {
    registerComponent: jest.fn(),
  },
}));
