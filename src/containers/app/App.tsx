import React from 'react';
import { Box, Flex } from 'rebass';
import styled from 'styled-components';
import Content from '../content/Content';
import Header from './components/Header';

class App extends React.Component<{}> {
  render() {
    const StyledWrapper = styled.div`
      height: 100%;
    `;

    return (
      <StyledWrapper>
        <Header />
        <Content />
      </StyledWrapper>
    );
  }
}

export default App;
