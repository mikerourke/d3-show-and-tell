import React from 'react';
import styled from 'styled-components';
import { Flex, Text } from 'rebass';
import { elementHeights } from '@constants';

interface Props {
  children: string;
}

const ColumnHeader: React.SFC<Props> = ({ children }) => {
  const StyledHeader = styled(Flex)`
    height: ${elementHeights.COLUMN_HEADER}px;
  `;

  const StyledText = styled(Text)`
    text-transform: uppercase;
  `;

  return (
    <StyledHeader px={8} align="center" justify="center">
      <StyledText fontSize={24} fontFamily="sans" bold color="#374047">
        {children}
      </StyledText>
    </StyledHeader>
  );
};

export default ColumnHeader;
