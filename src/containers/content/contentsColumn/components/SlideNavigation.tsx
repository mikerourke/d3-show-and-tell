import React from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarItem,
  NavbarMenu,
  NavbarStart,
  NavbarEnd,
  Title,
} from 'bloomer';
import { css } from 'emotion';
import IconButton from '@components/iconButton/IconButton';

interface Props {
  slideNumber: number;
  slideTitle: string;
}

export default class SlideNavigation extends React.Component<Props> {
  render() {
    const iconStyle = css`
      transform: rotate(90deg);
    `;

    const { slideNumber } = this.props;

    return (
      <Navbar
        className={css`
          margin-bottom: 8px;
        `}
      >
        <NavbarMenu
          className={css`
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <NavbarStart>
            <NavbarItem>
              <Link to={`/slides/${slideNumber - 1}`}>
                <IconButton iconName="arrowDown" className={iconStyle} />
              </Link>
            </NavbarItem>
          </NavbarStart>
          <NavbarItem>
            <Title id="slideTitle" isSize={4}>
              {this.props.slideTitle}
            </Title>
          </NavbarItem>
          <NavbarEnd>
            <NavbarItem>
              <Link to={`/slides/${slideNumber + 1}`}>
                <IconButton iconName="arrowUp" className={iconStyle} />
              </Link>
            </NavbarItem>
          </NavbarEnd>
        </NavbarMenu>
      </Navbar>
    );
  }
}
