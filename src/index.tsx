import 'whatwg-fetch';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '@redux/configureStore';
import Root from './containers/root/Root';
import App from './containers/app/App';
import 'animate.css/animate.min.css';

const store = configureStore();

render(
  <Provider store={store}>
    <Root>
      <App />
    </Root>
  </Provider>,
  document.getElementById('root') as HTMLElement,
);
