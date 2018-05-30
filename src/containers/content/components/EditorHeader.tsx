import React from 'react';
import { Box, Flex, Tabs, TabItem } from 'rebass';
import classnames from 'classnames';
import styled from 'styled-components';
import { elementHeights } from '@constants';
import IconButton from '@components/iconButton/IconButton';

interface Props {
  activeTab: number;
  onFormatClick: () => void;
  onRefreshClick: () => void;
  onSaveClick: () => void;
  onTabClick: (tabIndex: number) => void;
}

const EditorHeader: React.SFC<Props> = ({
  activeTab,
  onFormatClick,
  onRefreshClick,
  onSaveClick,
  onTabClick,
}) => {
  const StyledTabs = styled(Tabs)`
    border: unset;
    height: ${elementHeights.EDITOR_TABS}px;
    width: fit-content;

    .isActive {
      color: #7dbae5;
      border-bottom: 3px solid #7dbae5;
    }
  `;

  const StyledTab = styled(TabItem)`
    cursor: pointer;
    font-size: 16px;
    text-align: center;
    text-transform: uppercase;
    width: 128px;
  `;

  return (
    <Flex>
      <Box width={1 / 2}>
        <StyledTabs mt={2} mb={8}>
          {['Code', 'Data', 'Paths'].map(
            (tabName: string, tabIndex: number) => (
              <StyledTab
                key={tabName}
                mr={8}
                pt={0}
                pb={0}
                className={classnames({ isActive: tabIndex === activeTab })}
                onClick={() => onTabClick(tabIndex)}
              >
                View {tabName}
              </StyledTab>
            ),
          )}
        </StyledTabs>
      </Box>
      <Box width={1 / 2}>
        <Flex justify="flex-end" align="center">
          <IconButton iconName="save" onClick={onSaveClick} />
          <IconButton iconName="edit" onClick={onFormatClick} />
          <IconButton iconName="refresh" onClick={onRefreshClick} />
        </Flex>
      </Box>
    </Flex>
  );
};

export default EditorHeader;
