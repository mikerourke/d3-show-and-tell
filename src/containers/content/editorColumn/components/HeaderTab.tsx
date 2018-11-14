import React from 'react';
import cx from 'classnames';
import { NavbarItem } from 'bloomer';
import { css } from 'emotion';
import { getNameForContentType } from '@utils/commonUtils';
import { ContentType } from '@customTypes/content';

interface Props {
  isActive: boolean;
  contentType: ContentType;
  onTabClick: (tabIndex: number) => void;
}

/**
 * Single tab element with the Header that corresponds with contents (e.g.
 *    Code, Styles, etc.)
 * @param isActive Indicates if the tab is active.
 * @param contentType Type of content associated with the tab.
 * @param onTabClick Action to perform when the tab is clicked.
 * @functional
 */
const HeaderTab: React.SFC<Props> = ({ isActive, contentType, onTabClick }) => (
  <NavbarItem
    data-for="tabTooltip"
    data-tip={`⌥ + ${contentType + 1}`}
    onClick={() => onTabClick(contentType)}
    isActive={isActive}
    className={cx(
      css`
        cursor: pointer;
      `,
      {
        [css`
          border-bottom: 2px solid var(--pandera-blue);
        `]: isActive,
      },
    )}
  >
    {getNameForContentType(contentType)}
  </NavbarItem>
);

export default HeaderTab;
