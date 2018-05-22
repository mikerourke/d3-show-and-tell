import React from 'react';
import styled from 'styled-components';
import { Tabs } from 'rebass';
import ChartTab from './components/ChartTab';
import { CHART_NAMES } from '../../constants';
import ShowIf from '../../components/showIf/ShowIf';

interface State {
  activeTab: number;
}

class Charts extends React.Component<{}, State> {
  state = {
    activeTab: 0,
  };

  handleTabClick = (tabIndex: number) => () => {
    this.setState({ activeTab: tabIndex });
  };

  render() {
    const StyledWrapper = styled.div`
      width: 100%;
      height: 100%;

      .isActive {
        color: #7dbae5;
      }
    `;

    const StyledTabs = styled(Tabs)`
      width: fit-content;
    `;

    const { activeTab } = this.state;

    return (
      <StyledWrapper>
        <StyledTabs>
          {CHART_NAMES.map((chartName, chartIndex) => (
            <ChartTab
              key={chartName}
              isActive={activeTab === chartIndex}
              chartName={chartName}
              onTabClick={this.handleTabClick(chartIndex)}
            />
          ))}
        </StyledTabs>
        <ShowIf isShown={activeTab === 0} />
      </StyledWrapper>
    );
  }
}

export default Charts;
