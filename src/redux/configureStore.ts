import { compose, createStore, applyMiddleware } from 'redux';
import isUndefined from 'lodash/isUndefined';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';

/**
 * Configures the Redux store and adds Redux DevTools accomodations (if not in
 *    production).
 */
export default function configureStore() {
  const windowIfDefined =
    typeof window === 'undefined' ? null : (window as any);

  let composeEnhancers = compose;
  const devToolsCompose = windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

  if (
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    !isUndefined(devToolsCompose)
  ) {
    composeEnhancers = devToolsCompose({});
  }

  const enhancers = composeEnhancers(applyMiddleware(thunkMiddleware));
  return createStore(reducers, {}, enhancers);
}
