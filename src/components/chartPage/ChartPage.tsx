import React from 'react';
// import { renderToStaticMarkup } from 'react-dom/server';
import styled from 'styled-components';
import { Box, Code, Panel, PanelHeader, Text, Flex } from 'rebass';
import CollapsibleHeader from './components/CollapsibleHeader';
import ShowIf from '../showIf/ShowIf';

interface Props {
  chartContents: any;
  codeContents: any;
  dataContents: any;
}

interface State {
  codeShown: boolean;
  dataShown: boolean;
}

class ChartPage extends React.Component<Props, State> {
  state = {
    codeShown: true,
    dataShown: true,
  };

  handlePanelClick = (section: string) => () => {
    const sectionKey: any = `${section}Shown`;
    this.setState((state: any) => ({ [sectionKey]: !state[sectionKey] }));
  };

  render() {
    const { chartContents, codeContents, dataContents } = this.props;

    const StyledWrapper = styled.div`
      height: 100%;
      padding: 16px;
    `;

    const StyledPanel = styled(Panel)`
      width: 100%;
    `;

    const StyledSeparator = styled.div`
      height: 24px;
    `;

    return (
      <StyledWrapper>
        <Flex>
          <Box width={1 / 2} mr={4}>
            <Panel>
              <PanelHeader color="white" bg="dimgray">
                <Text fontSize={4}>CHART</Text>
              </PanelHeader>
              <Box p={2}>{chartContents}</Box>
            </Panel>
          </Box>
          <Box width={1 / 2} ml={4}>
            <StyledPanel>
              <CollapsibleHeader
                title="CODE"
                collapsed={!this.state.codeShown}
                onArrowClick={this.handlePanelClick('code')}
              />
              <ShowIf as={Box} p={2} isShown={this.state.codeShown}>
                {codeContents}
              </ShowIf>
            </StyledPanel>
            <StyledSeparator />
            <StyledPanel>
              <CollapsibleHeader
                title="DATA"
                collapsed={!this.state.dataShown}
                onArrowClick={this.handlePanelClick('data')}
              />
              <ShowIf as={Box} p={2} isShown={this.state.dataShown}>
                <div id="code-editor" />
              </ShowIf>
            </StyledPanel>
          </Box>
        </Flex>
      </StyledWrapper>
    );
  }
}

export default ChartPage;
