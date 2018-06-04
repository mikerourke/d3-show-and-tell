import React from 'react';
import { Navbar, NavbarBrand, NavbarItem, Title } from 'bloomer';
import { css } from 'emotion';
import IconButton from '@components/iconButton/IconButton';

interface Props {
  onToggleSidebar: () => void;
}

const Header: React.SFC<Props> = ({ onToggleSidebar }) => (
  <Navbar
    className={css`
      background: transparent;
      height: 4rem;
    `}
  >
    <NavbarBrand>
      <NavbarItem onClick={onToggleSidebar}>
        <IconButton iconName="menu" color="var(--pandera-blue)" />
      </NavbarItem>
      <NavbarItem>
        <Title
          isSize={3}
          className={css`
            color: var(--pandera-blue);
          `}
        >
          D3 Show and Tell
        </Title>
      </NavbarItem>
    </NavbarBrand>
  </Navbar>
);

export default Header;
