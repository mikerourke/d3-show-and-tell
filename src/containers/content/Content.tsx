import React from 'react';
import { Box, Flex } from 'rebass';
import { connect } from 'react-redux';
import isNil from 'lodash/isNil';
import {
  functionStrings,
  appendScriptToPage,
  getValidContent,
  getTransformedCode,
} from '../../utils/codeUtils';
import {
  fetchAllContent,
  updateActiveEditorTab,
  updateCurrentContent,
} from '../../redux/content/contentActions';
import {
  selectActiveEditorTab,
  selectAllContent,
  selectEditorContents,
  selectIsLoading,
} from '../../redux/content/contentSelectors';
import { State as ReduxState } from '../../redux/reducers';
import {
  ContentModel,
  ContentType,
  EditorContents,
} from '../../types/contentTypes';
import Editor from '../../components/editor/Editor';
import EditorTabs from './components/EditorTabs';
import ColumnHeader from './components/ColumnHeader';

interface Props {
  activeEditorTab: ContentType;
  editorContents: EditorContents;
  currentContent: ContentModel;
  isLoading: boolean;
  onFetchAllContent: (fileName: string) => Promise<any>;
  onUpdateActiveEditorTab: (contentType: ContentType) => void;
  onUpdateCurrentContent: (newValue: string) => void;
}

export class ContentComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    appendScriptToPage(
      'shared-code',
      Object.values(functionStrings).join('\n'),
    );
    this.props.onFetchAllContent('stockCharts').then(() => {
      this.updateScriptContents();
    });
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    // this.updateScriptContents();
  }

  updateScriptContents = () => {
    // Clear any existing chart content inside the contents element.
    const contentsElement = document.querySelector('#contents');
    if (!isNil(contentsElement)) contentsElement.innerHTML = '';

    const { code, data } = this.props.currentContent;
    const validCode = getValidContent(ContentType.Code, code);
    const validData = getValidContent(ContentType.Data, data);
    const content = `
      var currentData = ${validData};
      ${getTransformedCode(validCode)}
    `;
    appendScriptToPage('executed-code', content);
  };

  render() {
    return (
      <Flex
        p={16}
        justify="space-evenly"
        style={{ height: 'calc(100% - 64px)' }}
      >
        <Box width={1 / 2} mx={2}>
          <EditorTabs
            activeTab={this.props.activeEditorTab}
            onTabClick={tabIndex =>
              this.props.onUpdateActiveEditorTab(tabIndex)
            }
          />
          <Editor
            contents={this.props.editorContents}
            onEditorChange={this.props.onUpdateCurrentContent}
            onSaveKeysPressed={this.updateScriptContents}
            onUpdateTabUpdateKeysPressed={this.props.onUpdateActiveEditorTab}
          />
        </Box>
        <Box width={1 / 2} mx={2}>
          <ColumnHeader>Imagination Station&trade;</ColumnHeader>
          <div id="contents" className="chart" />
        </Box>
      </Flex>
    );
  }
}

export default connect(
  (state: ReduxState) => ({
    activeEditorTab: selectActiveEditorTab(state),
    editorContents: selectEditorContents(state),
    currentContent: selectAllContent(state),
    isLoading: selectIsLoading(state),
  }),
  (dispatch: any) => ({
    onFetchAllContent: fileName => dispatch(fetchAllContent(fileName)),
    onUpdateActiveEditorTab: contentType =>
      dispatch(updateActiveEditorTab(contentType)),
    onUpdateCurrentContent: newValue =>
      dispatch(updateCurrentContent(newValue)),
  }),
)(ContentComponent);
