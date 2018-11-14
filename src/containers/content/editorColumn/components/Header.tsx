import React from 'react';
import ReactTooltip from 'react-tooltip';
import {
  Button,
  Navbar,
  NavbarItem,
  NavbarStart,
  NavbarMenu,
  NavbarEnd,
} from 'bloomer';
import { css } from 'emotion';
import { contentTypeArray } from '@utils/commonUtils';
import HeaderTab from './HeaderTab';

interface Props {
  activeTab: number;
  onResetClick: () => void;
  onSaveClick: () => void;
  onTabClick: (tabIndex: number) => void;
}

/**
 * Editor header with tabs for navigating code types and Save/Reset buttons to
 *    apply changes.
 * @param activeTab Current active editor tab.
 * @param onResetClick Action to perform when Reset button is clicked.
 * @param onSaveClick Action to perform when Save button is clicked.
 * @param onTabClick Action to perform when a tab is clicked.
 * @functional
 */
const Header: React.SFC<Props> = ({
  activeTab,
  onResetClick,
  onSaveClick,
  onTabClick,
}) => (
  <Navbar
    className={css`
      margin-bottom: 8px;
      z-index: 0;
    `}
  >
    <NavbarMenu>
      <NavbarStart>
        {contentTypeArray.map(contentType => (
          <HeaderTab
            key={contentType}
            contentType={contentType}
            isActive={contentType === activeTab}
            onTabClick={onTabClick}
          />
        ))}
        <ReactTooltip
          id="tabTooltip"
          delayShow={500}
          getContent={dataTip => <span>Keyboard Shortcut: {dataTip}</span>}
        />
      </NavbarStart>
      <NavbarEnd>
        <NavbarItem>
          <Button
            isColor="dark"
            isOutlined
            isSize="small"
            onClick={onSaveClick}
          >
            Save
          </Button>
          <Button
            isColor="dark"
            isOutlined
            isSize="small"
            className={css`
              margin-left: 4px;
            `}
            onClick={onResetClick}
          >
            Reset
          </Button>
        </NavbarItem>
      </NavbarEnd>
    </NavbarMenu>
  </Navbar>
);

export default Header;
