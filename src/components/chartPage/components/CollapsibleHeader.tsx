import React from 'react';
import { Box, Flex, PanelHeader, Text } from 'rebass';
import ArrowButton from './ArrowButton';

interface Props {
  title: string;
  collapsed: boolean;
  onArrowClick: any;
}

const CollapsibleHeader: React.SFC<Props> = ({
  title,
  collapsed,
  onArrowClick,
}) => (
  <PanelHeader color="white" bg="dimgray">
    <Flex align="center">
      <Text fontSize={4}>{title}</Text>
      <Box ml="auto">
        <ArrowButton
          direction={collapsed ? 'down' : 'up'}
          onClick={onArrowClick}
        />
      </Box>
    </Flex>
  </PanelHeader>
);

export default CollapsibleHeader;
