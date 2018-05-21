import React from 'react';
import { render } from 'react-dom';
import Root from './containers/root/Root';
import App from './containers/app/App';
import 'animate.css/animate.min.css';

render(
  <Root>
    <App />
  </Root>,
  document.getElementById('root') as HTMLElement,
);
