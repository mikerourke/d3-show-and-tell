import React from 'react';
import { Route, Switch } from 'react-router';
import { Flex } from 'rebass';
import { ROUTES } from '../../constants';
import Charts from '../charts/Charts';
import Header from './components/Header';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Flex m={16}>
          <Switch>
            <Route path={ROUTES.charts.clientPath} component={Charts} />
          </Switch>
        </Flex>
      </div>
    );
  }
}

export default App;
