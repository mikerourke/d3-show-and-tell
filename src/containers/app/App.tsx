import React from 'react';
import { css } from 'emotion';
import { Route } from 'react-router';
import Content from '../content/Content';
import Navigation from './components/Navigation';
import { ROUTES } from '@constants';

/**
 * Application component that wraps navigation and content.
 * @functional
 */
const App: React.SFC = () => (
  <div style={{ height: '100%' }}>
    <Navigation />
    <div
      className={css`
        padding: 0 16px;
      `}
    >
      <Route
        path={`${ROUTES.slides.clientPath}/:slideNumber`}
        component={Content}
      />
    </div>
  </div>
);

export default App;
