import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

export function configureReduxStore(initialState = {}) {
  // add any other middlewares that might be used - to this array
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  return mockStore(initialState);
}
