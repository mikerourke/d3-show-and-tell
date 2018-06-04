import * as React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ROUTES } from '@constants';
import Root from './containers/root/Root';
import App from './containers/app/App';

const Routes = () => (
  <Root>
    <BrowserRouter>
      <Switch>
        <Route path="/" component={App} />
        <Redirect
          from={ROUTES.app.clientPath}
          to={`${ROUTES.slides.clientPath}/1`}
        />
      </Switch>
    </BrowserRouter>
  </Root>
);

export default Routes;
