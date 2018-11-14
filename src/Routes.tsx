import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ROUTES } from '@constants';
import App from '@containers/app/App';

/**
 * Routes handler for the entire application.
 * @functional
 */
const Routes: React.SFC = () => (
  <div>
    <BrowserRouter>
      <Switch>
        <Route path="/:path" component={App} />
        <Redirect
          from={ROUTES.app.clientPath}
          to={`${ROUTES.slides.clientPath}/1`}
        />
      </Switch>
    </BrowserRouter>
  </div>
);

export default Routes;
