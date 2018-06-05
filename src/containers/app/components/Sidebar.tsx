import React from 'react';
import { Menu, MenuLabel, MenuList } from 'bloomer';
import Drawer from 'react-motion-drawer';
import { css } from 'emotion';
import { Link } from 'react-router-dom';

interface Props {
  open: boolean;
  slideTitles: any[];
}

class Sidebar extends React.Component<Props> {
  render() {
    return (
      <Drawer
        open={this.props.open}
        drawerStyle={{
          boxShadow: 'var(--main-box-shadow)',
          background: 'rgba(255, 255, 255, 0.95)',
        }}
        zIndex={1}
        width={400}
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
                  <Link to={`/slides/${slideNumber}`}>{title}</Link>
                </li>
              ))}
            </MenuList>
          </Menu>
        </div>
      </Drawer>
    );
  }
}

export default Sidebar;
