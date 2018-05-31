import React from 'react';
import { Menu, MenuLabel, MenuLink, MenuList } from 'bloomer';
import Drawer from 'react-motion-drawer';
import { css } from 'emotion';

interface Props {
  open: boolean;
  onToggleSidebar: () => void;
}

const Sidebar: React.SFC<Props> = ({ open, onToggleSidebar }) => {
  const boxShadow =
    'rgba(0, 0, 0, 0.188235) 0px 10px 20px,' +
    'rgba(0, 0, 0, 0.227451) 0px 6px 6px';

  return (
    <Drawer
      open={open}
      drawerStyle={{
        boxShadow,
        background: 'rgba(255, 255, 255, 0.9)',
      }}
      zIndex={1}
      width={352}
    >
      <div
        className={css`
          margin-top: 72px;
          padding: 16px;
        `}
      >
        <Menu>
          <MenuLabel>Chapter 1</MenuLabel>
          <MenuList>
            <li>
              <MenuLink>Section 1</MenuLink>
            </li>
            <li>
              <MenuLink>Section 2</MenuLink>
            </li>
          </MenuList>
        </Menu>
      </div>
    </Drawer>
  );
};

export default Sidebar;
