import React from 'react';
import { css } from 'emotion';
import { Switch, Route } from 'react-router';
import Content from '../content/Content';
import Navigation from './components/Navigation';
import { ROUTES } from '@constants';

const App: React.SFC<{}> = () => (
  <div style={{ height: '100%' }}>
    <Navigation />
    <div
      className={css`
        padding: 0 16px;
      `}
    >
      <Switch>
        <Route
          path={`${ROUTES.slides.clientPath}/:slideNumber`}
          component={Content}
        />
      </Switch>
    </div>
  </div>
);

export default App;
