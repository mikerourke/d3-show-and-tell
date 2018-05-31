import React from 'react';
import Content from '../content/Content';
import Navigation from './components/Navigation';

const App: React.SFC<{}> = () => (
  <div style={{ height: '100%' }}>
    <Navigation />
    <Content />
  </div>
);

export default App;
