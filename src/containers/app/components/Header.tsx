import React from 'react';
import { Navbar, NavbarBrand, NavbarItem, Title } from 'bloomer';
import { css } from 'emotion';
import FontIcon from '@components/fontIcon/FontIcon';

interface Props {
  onToggleSidebar: () => void;
}

const Header: React.SFC<Props> = ({ onToggleSidebar }) => {
  const iconStyle = css`
    cursor: pointer;

    &:hover {
      opacity: 0.5;
    }
  `;

  return (
    <Navbar
      className={css`
        background: transparent;
      `}
    >
      <NavbarBrand>
        <NavbarItem onClick={onToggleSidebar}>
          <FontIcon isSize="medium" className={iconStyle} iconName="bars" />
        </NavbarItem>
        <NavbarItem>
          <Title isSize={3}>D3 Show and Tell</Title>
        </NavbarItem>
      </NavbarBrand>
    </Navbar>
  );
};

export default Header;
