import React from 'react';
import { Provider } from 'rebass';
import { injectGlobal } from 'styled-components';

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Quicksand|Roboto+Mono');
  
  body {
    height: 100vh;
    margin: 0;
    padding: 0;
  }
`;

const Root = ({ children }) => (
  <Provider
    theme={{
      fonts: {
        sans: '"Quicksand", Helvetica, sans-serif',
      },
    }}
  >
    <div>{children}</div>
  </Provider>
);

export default Root;
