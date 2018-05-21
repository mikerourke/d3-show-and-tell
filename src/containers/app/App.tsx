import React from 'react';
import { Flex } from 'rebass';
import Charts from '../charts/Charts';
import Header from './components/Header';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Flex m={16}>
          <Charts />
        </Flex>
      </div>
    );
  }
}

export default App;
