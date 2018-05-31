import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface State {
  sidebarOpen: boolean;
}

export default class Navigation extends React.Component<{}, State> {
  state = {
    sidebarOpen: false,
  };

  handleToggleSidebar = () => {
    console.log('Yayayaya');
    this.setState(state => ({ sidebarOpen: !state.sidebarOpen }));
  };

  render() {
    return (
      <React.Fragment>
        <Header onToggleSidebar={this.handleToggleSidebar} />
        <Sidebar
          open={this.state.sidebarOpen}
          onToggleSidebar={this.handleToggleSidebar}
        />
      </React.Fragment>
    );
  }
}
