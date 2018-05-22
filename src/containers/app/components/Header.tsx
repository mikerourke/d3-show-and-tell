import React from 'react';
import { Heading, Toolbar } from 'rebass';
import styled from 'styled-components';

const Header: React.SFC<{}> = () => {
  const StyledHeading = styled(Heading)`
    font-family: Quicksand, Helvetica, sans-serif;
  `;
  return (
    <Toolbar p={2}>
      <StyledHeading is="h2" ml={2}>
        D3 SHOW AND TELL
      </StyledHeading>
    </Toolbar>
  );
};

export default Header;
