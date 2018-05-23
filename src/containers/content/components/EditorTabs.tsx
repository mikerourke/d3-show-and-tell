import React from 'react';
import { Tabs, TabItem } from 'rebass';
import classnames from 'classnames';
import styled from 'styled-components';
import { elementHeights } from '../../../constants';

interface Props {
  activeTab: number;
  onTabClick: (tabIndex: number) => void;
}

const EditorTabs: React.SFC<Props> = ({ activeTab, onTabClick }) => {
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
    <StyledTabs mt={2} mb={8}>
      {['Code', 'Data'].map((tabName: string, tabIndex: number) => (
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
      ))}
    </StyledTabs>
  );
};

export default EditorTabs;
