import React from 'react';
import classnames from 'classnames';
import { NavbarItem } from 'bloomer';
import { css } from 'emotion';
import { ContentType } from '@customTypes/contentTypes';
import { getNameForContentType } from '@utils/commonUtils';

interface Props {
  activeTab: ContentType;
  contentType: ContentType;
  onTabClick: (tabIndex: number) => void;
}

const HeaderTab: React.SFC<Props> = ({
  activeTab,
  contentType,
  onTabClick,
}) => {
  const activeItemStyle = css`
    border-bottom: 2px solid var(--pandera-blue);
  `;

  const navbarItemStyle = css`
    cursor: pointer;
  `;

  const isActive = activeTab === contentType;

  return (
    <NavbarItem
      data-for="tabTooltip"
      data-tip={`⌥ + ${contentType + 1}`}
      onClick={() => onTabClick(contentType)}
      isActive={isActive}
      className={classnames(navbarItemStyle, {
        [activeItemStyle]: isActive,
      })}
    >
      {getNameForContentType(contentType)}
    </NavbarItem>
  );
};

export default HeaderTab;
