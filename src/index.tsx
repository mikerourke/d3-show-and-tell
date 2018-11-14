import 'whatwg-fetch';
import 'animate.css/animate.min.css';
import 'bulma/css/bulma.min.css';
import './styles.css';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import configureStore from '@redux/configureStore';
import { initializeStorage } from '@redux/content/contentActions';
import Routes from './Routes';

const store = configureStore();
createHistory();

store.dispatch<any>(initializeStorage()).then(() =>
  render(
    <Provider store={store}>
      <Routes />
    </Provider>,
    document.getElementById('root') as HTMLElement,
  ),
);
