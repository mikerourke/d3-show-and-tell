import React from 'react';
import { Navbar, NavbarItem, NavbarMenu } from 'bloomer';
import { css } from 'emotion';
import IconButton from '@components/iconButton/IconButton';

interface Props {
  slideTitle: string;
  onPreviousClick: () => void;
  onNextClick: () => void;
}

const SlideNavigation: React.SFC<Props> = ({
  slideTitle,
  onPreviousClick,
  onNextClick,
}) => {
  return (
    <Navbar>
      <NavbarMenu
        className={css`
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        <NavbarItem>
          <IconButton onClick={onPreviousClick} iconName="arrowUp" />
        </NavbarItem>
        <NavbarItem>{slideTitle}</NavbarItem>
        <NavbarItem>
          <IconButton onClick={onNextClick} iconName="arrowDown" />
        </NavbarItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default SlideNavigation;
