import React from 'react';
import { Columns, Column, Title } from 'bloomer';
import { css } from 'emotion';
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
  fetchAllContents,
  loadSlideContentsIntoCurrent,
  updateActiveEditorTab,
  updateCurrentContent,
  updateCurrentPaths,
} from '@redux/content/contentActions';
import {
  selectActiveEditorTab,
  selectCurrentContent,
  selectEditorContents,
  selectIsLoading,
  selectIsSlideContentPresent,
  selectSlideContentsForSlideNumber,
} from '@redux/content/contentSelectors';
import { State as ReduxState } from '@redux/reducers';
import {
  ContentModel,
  ContentType,
  EditorContents,
} from '@customTypes/contentTypes';
import Editor from './components/Editor';
import EditorHeader from './components/EditorHeader';
import { loadCursorPosition, saveCursorPosition } from '@utils/editorUtils';
import {
  getPathComponentsFromContents,
  updatePathsFromChanges,
} from '@utils/svgPathUtils';

interface StateProps {
  activeEditorTab: ContentType;
  editorContents: EditorContents;
  currentContent: ContentModel;
  isLoading: boolean;
  isSlideContentPresent: boolean;
  slideContents: any;
}

interface DispatchProps {
  onFetchAllContents: () => Promise<any>;
  onLoadSlideContentsIntoCurrent: () => void;
  onUpdateActiveEditorTab: (contentType: ContentType) => void;
  onUpdateCurrentContent: (newValue: string) => void;
  onUpdateCurrentPaths: (newValue: string) => void;
}

interface OwnProps {
  match: {
    params: {
      slideNumber: string;
    };
  };
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
  tabsShown: { [contentType: number]: boolean };
}

export class ContentComponent extends React.Component<Props, State> {
  contentElement: any;
  editor: any;

  constructor(props: Props) {
    super(props);
    this.contentElement = null;
    this.editor = null;

    this.state = {
      tabsShown: {
        [ContentType.Code]: true,
        [ContentType.Data]: true,
        [ContentType.Paths]: false,
      },
    };
    this.initializeContent();
  }

  componentDidMount() {
    setTimeout(() => {
      const pathsValue = getPathComponentsFromContents();
      this.props.onUpdateCurrentPaths(pathsValue);
      this.updateTabShown(ContentType.Paths, pathsValue !== null);
    }, 1000);
  }

  componentDidUpdate() {
    this.props.onLoadSlideContentsIntoCurrent();
    loadCursorPosition(this.editor, this.props.activeEditorTab);
    this.editor.focus();
  }

  initializeContent = async () => {
    if (!this.props.isSlideContentPresent) {
      await this.props.onFetchAllContents();
    }

    this.props.onLoadSlideContentsIntoCurrent();

    setTimeout(() => {
      appendScriptToPage(
        'shared-code',
        Object.values(functionStrings).join('\n'),
      );
      this.updateScriptContents();
    }, 0);
  };

  updateTabShown = (contentType: ContentType, isShown: boolean) =>
    this.setState(state => ({
      tabsShown: {
        ...state.tabsShown,
        [contentType]: isShown,
      },
    }));

  updateScriptContents = () => {
    const { code, data } = this.props.currentContent;
    this.updateTabShown(ContentType.Data, data !== '');

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
    if (!this.editor) this.editor = editor;
  };

  handleActiveEditorTabChange = (tabIndex: number) => {
    if (!this.state.tabsShown[tabIndex]) return;
    saveCursorPosition(this.editor, this.props.activeEditorTab);
    this.props.onUpdateActiveEditorTab(tabIndex);
  };

  handleSaveAction = () => {
    if (this.props.activeEditorTab === ContentType.Paths) {
      const editorValue = this.editor.getValue();
      updatePathsFromChanges(editorValue);
      this.props.onUpdateCurrentPaths(editorValue);
    } else {
      this.updateScriptContents();
    }
  };

  handleResetClick = () => {

  }

  render() {
    return (
      <Columns
        className={css`
          margin: 8px;
        `}
      >
        <Column>
          <EditorHeader
            activeTab={this.props.activeEditorTab}
            tabsShown={this.state.tabsShown}
            onResetClick={() => {}}
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
        </Column>
        <Column>
          <Title isFullWidth hasTextAlign="centered" hasTextColor="dark">
            Imagination Station&trade;
          </Title>
          <div id="contents" className="chart" />
        </Column>
      </Columns>
    );
  }
}

export default connect(
  (
    state: ReduxState,
    {
      match: {
        params: { slideNumber },
      },
    }: OwnProps,
  ) => ({
    activeEditorTab: selectActiveEditorTab(state),
    editorContents: selectEditorContents(state),
    currentContent: selectCurrentContent(state),
    isLoading: selectIsLoading(state),
    isSlideContentPresent: selectIsSlideContentPresent(state),
    slideContents: selectSlideContentsForSlideNumber(state, slideNumber),
  }),
  (
    dispatch: any,
    {
      match: {
        params: { slideNumber },
      },
    }: OwnProps,
  ) => ({
    onFetchAllContents: () => dispatch(fetchAllContents()),
    onLoadSlideContentsIntoCurrent: () =>
      dispatch(loadSlideContentsIntoCurrent(slideNumber)),
    onUpdateActiveEditorTab: contentType =>
      dispatch(updateActiveEditorTab(contentType)),
    onUpdateCurrentContent: newValue =>
      dispatch(updateCurrentContent(newValue)),
    onUpdateCurrentPaths: newValue => dispatch(updateCurrentPaths(newValue)),
  }),
)(ContentComponent);
