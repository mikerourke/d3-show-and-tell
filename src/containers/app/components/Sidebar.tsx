import React from 'react';
import { Menu, MenuLabel, MenuList } from 'bloomer';
import Drawer from 'react-motion-drawer';
import { css } from 'emotion';
import { Link } from 'react-router-dom';

interface Props {
  open: boolean;
  onToggleSidebar: () => void;
  slideTitles: any[];
}

export default class Sidebar extends React.Component<Props> {
  handleLinkClick = () => {
    setTimeout(() => this.props.onToggleSidebar(), 500);
  };

  render() {
    return (
      <Drawer
        open={this.props.open}
        drawerStyle={{
          boxShadow: 'var(--main-box-shadow)',
          background: 'rgba(255, 255, 255, 0.95)',
        }}
        config={{
          stiffness: 200,
          damping: 50,
        }}
        zIndex={1}
        width={400}
        fadeOut
      >
        <div
          className={css`
            margin-top: 72px;
            padding: 16px;
          `}
        >
          <Menu>
            <MenuLabel>Slides</MenuLabel>
            <MenuList>
              {this.props.slideTitles.map(({ slideNumber, title }) => (
                <li key={slideNumber}>
                  <Link
                    to={`/slides/${slideNumber}`}
                    onClick={this.handleLinkClick}
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </MenuList>
          </Menu>
        </div>
      </Drawer>
    );
  }
}
