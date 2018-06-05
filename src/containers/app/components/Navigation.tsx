import React from 'react';
import { connect } from 'react-redux';
import { selectSlideTitles } from '@redux/content/contentSelectors';
import { State as ReduxState } from '@redux/reducers';
import Header from './Header';
import Sidebar from './Sidebar';

interface Props {
  slideTitles: any[];
}

interface State {
  sidebarOpen: boolean;
}

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
    const { slideTitles } = this.props;
    return (
      <React.Fragment>
        <Header onToggleSidebar={this.handleToggleSidebar} />
        <Sidebar open={this.state.sidebarOpen} slideTitles={slideTitles} />
      </React.Fragment>
    );
  }
}

export default connect((state: ReduxState) => ({
  slideTitles: selectSlideTitles(state),
}))(Navigation);
