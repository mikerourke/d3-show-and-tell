import React from 'react';
import { Heading, Toolbar } from 'rebass';
import styled from 'styled-components';
import { elementHeights } from '@constants';

const Header: React.SFC<{}> = () => {
  const StyledToolbar = styled(Toolbar)`
    height: ${elementHeights.APP_HEADER}px;
  `;

  return (
    <StyledToolbar p={2}>
      <Heading is="h2" ml={2}>
        D3 SHOW AND TELL
      </Heading>
    </StyledToolbar>
  );
};

export default Header;
