import React from 'react';
import {
  Button,
  Navbar,
  NavbarItem,
  NavbarStart,
  NavbarMenu,
  NavbarEnd,
} from 'bloomer';
import classnames from 'classnames';
import { css } from 'emotion';
import { ContentType } from '@customTypes/contentTypes';

interface Props {
  activeTab: number;
  tabsShown: { [contentType: number]: boolean };
  onResetClick: () => void;
  onSaveClick: () => void;
  onTabClick: (tabIndex: number) => void;
}

const EditorHeader: React.SFC<Props> = ({
  activeTab,
  tabsShown,
  onResetClick,
  onSaveClick,
  onTabClick,
}) => {
  const activeItemStyle = css`
    border-bottom: 2px solid var(--pandera-blue);
  `;

  const renderNavbarItem = (title: string, contentType: ContentType) => {
    if (!tabsShown[contentType]) return null;

    const navbarItemStyle = css`
      cursor: pointer;
    `;

    const isActive = activeTab === contentType;
    return (
      <NavbarItem
        onClick={() => onTabClick(contentType)}
        isActive={isActive}
        className={classnames(navbarItemStyle, {
          [activeItemStyle]: isActive,
        })}
      >
        View {title}
      </NavbarItem>
    );
  };

  const buttonStyle = css`
    margin-left: 4px;
  `;

  return (
    <Navbar
      className={css`
        margin-bottom: 8px;
        z-index: 0;
      `}
    >
      <NavbarMenu>
        <NavbarStart>
          {renderNavbarItem('Code', ContentType.Code)}
          {renderNavbarItem('Data', ContentType.Data)}
          {renderNavbarItem('Paths', ContentType.Paths)}
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
              className={buttonStyle}
              onClick={onResetClick}
            >
              Reset
            </Button>
          </NavbarItem>
        </NavbarEnd>
      </NavbarMenu>
    </Navbar>
  );
};

export default EditorHeader;
