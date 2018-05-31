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
  const activeItemStyle = css`
    border-bottom: 2px solid deepskyblue;
  `;

  const renderNavbarItem = (title: string, contentType: ContentType) => (
    <NavbarItem
      onClick={() => onTabClick(contentType)}
      href="#"
      isActive={activeTab === contentType}
      className={classnames({ [activeItemStyle]: activeTab === contentType })}
    >
      View {title}
    </NavbarItem>
  );

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
              onClick={onRefreshClick}
            >
              Reset
            </Button>
            <Button
              isColor="dark"
              isOutlined
              isSize="small"
              className={buttonStyle}
              onClick={onFormatClick}
            >
              Format
            </Button>
          </NavbarItem>
        </NavbarEnd>
      </NavbarMenu>
    </Navbar>
  );
};

export default EditorHeader;
