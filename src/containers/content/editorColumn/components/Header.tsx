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

const Header: React.SFC<Props> = ({
  onResetClick,
  onSaveClick,
  ...rest
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
            {...rest}
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
