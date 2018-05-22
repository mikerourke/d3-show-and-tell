import React from 'react';
import { Box, Flex, Panel, PanelHeader, Text } from 'rebass';
import startCase from 'lodash/startCase';
import Header from './components/Header';
import Editor from '../../components/editor/Editor';
import lineChart from '../charts/snippets/lineChart';
import stocksData from '../charts/data/stocks';
import styled from 'styled-components';

interface State {
  code: any;
  data: any;
  activeContent: any;
}

class App extends React.Component<{}, State> {
  codeElement: any;

  state = {
    code: lineChart,
    data: stocksData,
    activeContent: 'data',
  };

  getValidData = () => JSON.stringify(this.state.data, null, '  ');

  updateScriptContents = () => {
    if (this.codeElement) {
      document.body.removeChild(this.codeElement);
    }
    this.codeElement = document.createElement('script');
    this.codeElement.text = `
      var stocksData = ${this.getValidData()};
      (function() {${this.state.code}})();
    `;
    document.body.appendChild(this.codeElement);
  };

  componentDidMount() {
    this.updateScriptContents();
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    this.updateScriptContents();
  }

  onEditorChange = (newValue: any) => {
    const { activeContent } = this.state;
    const validValue =
      activeContent === 'data' ? JSON.parse(newValue) : newValue;
    this.setState({ [activeContent as any]: validValue });
  };

  handleSaveKeysPressed = () => {
    this.updateScriptContents();
  };

  swapType = () => {
    const swappedType = this.state.activeContent === 'data' ? 'code' : 'data';
    this.setState({ activeContent: swappedType });
  };

  render() {
    const StyledPanel = styled(Panel)`
      height: 100%;
      max-height: 800px;
      width: 100%;
      font-family: Quicksand, Helvetica, sans-serif;
    `;

    const { activeContent, code } = this.state;
    const contents = activeContent === 'data' ? this.getValidData() : code;

    return (
      <div>
        <Header />
        <Flex m={16} justify="space-evenly">
          <Box
            width={1 / 2}
            mx={2}
            style={{ position: 'relative', maxWidth: 800 }}
          >
            <StyledPanel>
              <PanelHeader color="white" bg="dimgray">
                <Flex align="center">
                  <Text fontSize={4}>{startCase(activeContent)}</Text>
                </Flex>
              </PanelHeader>
              <div style={{ height: 620, background: 'transparent' }} />
            </StyledPanel>
            <Editor
              contents={contents}
              language={activeContent === 'data' ? 'json' : 'javascript'}
              onEditorChange={this.onEditorChange}
              onSaveKeysPressed={this.handleSaveKeysPressed}
              onSwapContents={this.swapType}
            />
          </Box>
          <Box
            width={1 / 2}
            mx={2}
            style={{ position: 'relative', maxWidth: 800 }}
          >
            <StyledPanel>
              <PanelHeader color="white" bg="dimgray">
                <Flex align="center">
                  <Text fontSize={4}>Results</Text>
                </Flex>
              </PanelHeader>
              <div className="chart" style={{ height: 620 }} />
            </StyledPanel>
          </Box>
        </Flex>
      </div>
    );
  }
}

export default App;
