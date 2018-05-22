import React from 'react';
import { Box, Flex } from 'rebass';
import styled from 'styled-components';
import Header from './components/Header';
import Editor from '../../components/editor/Editor';
import { code, data } from '../../contents';
import { BoxDimensions } from '../../types/commonTypes';

const contentTypes = {
  code: 'currentCode',
  data: 'currentData',
};

interface State {
  currentCode: string;
  currentData: string | object;
  contentType: string;
  screenDimensions: BoxDimensions;
}

const getUpdatedDimensions = (): BoxDimensions => ({
  height: window.innerHeight,
  width: window.innerWidth,
});

class App extends React.Component<{}, State> {
  codeElement: HTMLScriptElement;

  state = {
    currentCode: code.charts.stocksChart,
    currentData: data.charts.stocksData,
    contentType: contentTypes.code,
    screenDimensions: getUpdatedDimensions(),
  };

  componentDidMount() {
    this.updateScriptContents();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    this.updateScriptContents();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    console.log('Yay');
    this.setState({ screenDimensions: getUpdatedDimensions() });
  };

  getValidData = () => JSON.stringify(this.state.currentData, null, '  ');

  updateScriptContents = () => {
    if (this.codeElement) {
      document.body.removeChild(this.codeElement);
    }
    document.querySelector('.chart').innerHTML = '';
    this.codeElement = document.createElement('script');
    this.codeElement.text = `
      var stocksData = ${this.getValidData()};
      (function() {${this.state.currentCode}})();
    `;
    document.body.appendChild(this.codeElement);
  };

  onEditorChange = (newValue: any) => {
    const { contentType } = this.state;
    const validValue =
      contentType === contentTypes.data ? JSON.parse(newValue) : newValue;
    this.setState({ [contentType as any]: validValue });
  };

  handleSaveKeysPressed = () => {
    this.updateScriptContents();
  };

  swapType = () => {
    const swappedType = {
      [contentTypes.code]: contentTypes.data,
      [contentTypes.data]: contentTypes.code,
    }[this.state.contentType];
    this.setState({ contentType: swappedType });
  };

  getDimensions = (): any => {
    const { width, height } = this.state.screenDimensions;
    const view = { width, height };

    const margins = {
      top: 16,
      right: 16,
      bottom: 24,
      left: 16,
    };

    return {
      view,
      margins,
      width: view.width - margins.left - margins.right,
      height: view.height - margins.top - margins.bottom,
    };
  };

  render() {
    const { contentType, currentCode } = this.state;
    const contents =
      contentType === contentTypes.data ? this.getValidData() : currentCode;

    const language = {
      [contentTypes.code]: 'javascript',
      [contentTypes.data]: 'json',
    }[contentType];

    const screenDimensions = this.getDimensions();
    const dimensions = {
      height: screenDimensions.height - 64,
      width: screenDimensions.width / 2 - 32,
    };

    return (
      <div>
        <Header />
        <Flex m={16} justify="space-evenly">
          <Box
            width={1 / 2}
            mx={2}
            pt={2}
            style={{ border: '2px solid black' }}
          >
            <Editor
              contents={contents}
              language={language}
              onEditorChange={this.onEditorChange}
              onSaveKeysPressed={this.handleSaveKeysPressed}
              onSwapContents={this.swapType}
              dimensions={dimensions}
            />
          </Box>
          <Box width={1 / 2} mx={2}>
            <div className="chart" />
          </Box>
        </Flex>
      </div>
    );
  }
}

export default App;
