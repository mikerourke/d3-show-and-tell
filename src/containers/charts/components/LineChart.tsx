import React from 'react';
import ChartPage from '../../../components/chartPage/ChartPage';
import data from '../data/stocks';

interface State {
  code: string;
  chartContents: any;
}

class LineChart extends React.Component<{}, State> {
  state = {
    code: '// This is some code;',
    chartContents: '',
  };

  handleOnCodeChange = (event: any) => {
    this.setState({ code: event.currentTarget.value });
  };

  renderCodeContents = () => {
    return (
      <textarea onChange={this.handleOnCodeChange} value={this.state.code} />
    );
  };

  render() {
    return (
      <ChartPage
        chartContents={this.state.chartContents}
        codeContents={this.renderCodeContents()}
        dataContents={JSON.stringify(data)}
      />
    );
  }
}

export default LineChart;
