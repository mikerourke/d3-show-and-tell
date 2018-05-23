import React from 'react';
import { Provider } from 'rebass';
import { injectGlobal } from 'styled-components';

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,700|Roboto+Mono');
  
  body {
    height: 100vh;
    margin: 0;
    padding: 0;
  }
`;

const Root = ({ children }) => (
  <Provider
    theme={{
      font: '"Roboto", Helvetica, sans-serif',
      monospace: '"Hack"',
    }}
  >
    <div>{children}</div>
  </Provider>
);

export default Root;
