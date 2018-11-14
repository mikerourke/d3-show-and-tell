import React from 'react';
import { connect } from 'react-redux';
import { selectSlideTitleRecords } from '@redux/content/contentSelectors';
import Header from './Header';
import Sidebar from './Sidebar';
import { ReduxState } from '@customTypes/common';
import { SlideTitleModel } from '@customTypes/content';

interface Props {
  slideTitleRecords: SlideTitleModel[];
}

interface State {
  sidebarOpen: boolean;
}

/**
 * Wrapper for Header and Sidebar navigation elements.
 * @param slideTitleRecords Array of objects with slide number and corresponding
 *    title for slide.
 * @connected
 */
class Navigation extends React.Component<Props, State> {
  state = {
    sidebarOpen: false,
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.state.sidebarOpen !== nextState.sidebarOpen;
  }

  handleToggleSidebar = () => {
    this.setState(state => ({ sidebarOpen: !state.sidebarOpen }));
  };

  render() {
    return (
      <React.Fragment>
        <Header onToggleSidebar={this.handleToggleSidebar} />
        <Sidebar
          open={this.state.sidebarOpen}
          onToggleSidebar={this.handleToggleSidebar}
          slideTitleRecords={this.props.slideTitleRecords}
        />
      </React.Fragment>
    );
  }
}

export default connect((state: ReduxState) => ({
  slideTitleRecords: selectSlideTitleRecords(state),
}))(Navigation);
