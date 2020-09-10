import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import devTools from 'remote-redux-devtools';
import { persistStore, autoRehydrate } from 'redux-persist';
import reducers from './reducers';

export default function configureStore(onCompletion) {
  const enhancer = compose(
    applyMiddleware(thunk),
    devTools({
      name: 'coparttransporter',
      realtime: true,
      hostname: 'localhost',
      port: 8000, // pointing to local remotedev server
    }),
    autoRehydrate(),
  );
  const store = createStore(reducers, enhancer);
  persistStore(store, { storage: AsyncStorage }, () => onCompletion(store));
  // return store;
}
