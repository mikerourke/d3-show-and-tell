import React from 'react';
import { Box, Flex } from 'rebass';
import { connect } from 'react-redux';
import isNil from 'lodash/isNil';
import {
  functionStrings,
  appendScriptToPage,
  getValidContent,
  getTransformedCode,
  validateCode,
} from '@utils/codeUtils';
import {
  fetchAllContent,
  updateActiveEditorTab,
  updateCurrentContent,
  updateCurrentPaths,
} from '@redux/content/contentActions';
import {
  selectActiveEditorTab,
  selectAllContent,
  selectEditorContents,
  selectIsLoading,
} from '@redux/content/contentSelectors';
import { State as ReduxState } from '@redux/reducers';
import {
  ContentModel,
  ContentType,
  EditorContents,
} from '@customTypes/contentTypes';
import Editor from './components/Editor';
import EditorHeader from './components/EditorHeader';
import ColumnHeader from './components/ColumnHeader';
import { loadCursorPosition, saveCursorPosition } from '@utils/editorUtils';
import {
  getPathComponentsFromContents,
  updatePathsFromChanges,
} from '@utils/svgPathUtils';

interface Props {
  activeEditorTab: ContentType;
  editorContents: EditorContents;
  currentContent: ContentModel;
  isLoading: boolean;
  onFetchAllContent: (fileName: string) => Promise<any>;
  onUpdateActiveEditorTab: (contentType: ContentType) => void;
  onUpdateCurrentContent: (newValue: string) => void;
  onUpdateCurrentPaths: (newValue: string) => void;
}

interface State {
  editor: any;
}

export class ContentComponent extends React.Component<Props, State> {
  contentElement: any;

  constructor(props: Props) {
    super(props);
    this.contentElement = null;
    this.state = {
      editor: null,
    };

    appendScriptToPage(
      'shared-code',
      Object.values(functionStrings).join('\n'),
    );

    this.props.onFetchAllContent('stockCharts').then(() => {
      this.updateScriptContents();
    });
  }

  componentDidMount() {
    setTimeout(() => {
      const pathsValue = getPathComponentsFromContents();
      this.props.onUpdateCurrentPaths(pathsValue);
    }, 1000);
  }

  componentDidUpdate() {
    loadCursorPosition(this.state.editor, this.props.activeEditorTab);
    this.state.editor.focus();
  }

  updateScriptContents = () => {
    const { code, data } = this.props.currentContent;
    if (!validateCode(code)) return;

    // Clear any existing chart content inside the contents element.
    const contentsElement = document.querySelector('#contents');
    if (!isNil(contentsElement)) contentsElement.innerHTML = '';

    const validCode = getValidContent(ContentType.Code, code);
    const validData = getValidContent(ContentType.Data, data);
    const content = `
      var currentData = ${validData};
      ${getTransformedCode(validCode)}
    `;
    eval(content);
  };

  handleEditorDidMount = (editor: any) => {
    if (!this.state.editor) this.setState({ editor });
  };

  handleFormatButtonClick = () => {
    this.state.editor.trigger('keyboard', 'editor.action.formatDocument');
  };

  handleActiveEditorTabChange = (tabIndex: number) => {
    saveCursorPosition(this.state.editor, this.props.activeEditorTab);
    this.props.onUpdateActiveEditorTab(tabIndex);
  };

  handleSaveAction = () => {
    if (this.props.activeEditorTab === ContentType.Paths) {
      const editorValue = this.state.editor.getValue();
      updatePathsFromChanges(editorValue);
      this.props.onUpdateCurrentPaths(editorValue);
    } else {
      this.updateScriptContents();
    }
  };

  render() {
    return (
      <div>
        <Flex
          p={16}
          justify="space-evenly"
          style={{ height: 'calc(100% - 64px)' }}
        >
          <Box width={1 / 2} mx={2}>
            <EditorHeader
              activeTab={this.props.activeEditorTab}
              onFormatClick={this.handleFormatButtonClick}
              onRefreshClick={() => {}}
              onSaveClick={this.handleSaveAction}
              onTabClick={this.handleActiveEditorTabChange}
            />
            <Editor
              contents={this.props.editorContents}
              onEditorDidMount={this.handleEditorDidMount}
              onEditorChange={this.props.onUpdateCurrentContent}
              onSaveKeysPressed={this.handleSaveAction}
              onUpdateTabKeysPressed={this.handleActiveEditorTabChange}
            />
          </Box>
          <Box width={1 / 2} mx={2} px={4}>
            <ColumnHeader>Imagination Station&trade;</ColumnHeader>
            <div id="contents" className="chart" />
          </Box>
        </Flex>
      </div>
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
    onUpdateCurrentPaths: newValue => dispatch(updateCurrentPaths(newValue)),
  }),
)(ContentComponent);
