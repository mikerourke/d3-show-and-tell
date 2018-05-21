import React from 'react';
import { Heading, Toolbar } from 'rebass';

const Header: React.SFC<{}> = () => (
  <Toolbar p={2}>
    <Heading is="h2" ml={2}>
      D3 SHOW AND TELL
    </Heading>
  </Toolbar>
);

export default Header;
