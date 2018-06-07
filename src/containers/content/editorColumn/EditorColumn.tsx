import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { css } from 'emotion';
import ReactTooltip from 'react-tooltip';
import { applyChangesToContent, extrapolatePaths } from '@utils/codeUtils';
import {
  highlightBookmarks,
  loadCursorPosition,
  resetAllCursorPositions,
  saveStateForContentType,
} from '@utils/editorUtils';
import {
  getStorageForContentType,
  setStorageForContentType,
} from '@utils/storageUtils';
import { selectActiveEditorTab } from '@redux/content/contentSelectors';
import {
  resetActiveTabContents,
  updateActiveEditorTab,
  updateStorageForSlideNumber,
} from '@redux/content/contentActions';
import { ContentType } from '@customTypes/contentTypes';
import { CodeEditor } from '@customTypes/commonTypes';
import { State as ReduxState } from '@redux/reducers';
import Editor from './components/Editor';
import GoToBookmarkButton from './components/GoToBookmarkButton';
import Header from './components/Header';

interface StateProps {
  activeEditorTab: ContentType;
}

interface DispatchProps {
  onUpdateActiveEditorTab: (contentType: ContentType) => void;
  onUpdateStorageForSlideNumber: (slideNumber: number) => void;
  onResetActiveTabContents: (contentType: ContentType) => Promise<any>;
}

interface OwnProps {
  className: string;
  slideNumber: number;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
  editorValue: string;
  editorLanguage: string;
}

export class EditorColumnComponent extends React.Component<Props, State> {
  editor: CodeEditor | null;

  constructor(props: Props) {
    super(props);
    this.editor = null;
    this.state = {
      editorValue: '',
      editorLanguage: 'javascript',
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.slideNumber !== this.props.slideNumber) {
      this.props.onUpdateStorageForSlideNumber(this.props.slideNumber);
      this.updateAndApplyChanges(this.props.activeEditorTab);
      resetAllCursorPositions(this.editor);
      this.editor.focus();
    }

    if (this.state.editorValue === this.state.editorValue) {
      setTimeout(() => highlightBookmarks(this.editor), 50);
    }
  }

  private setValueForActiveTab = (contentType: ContentType) => {
    const currentStorage = getStorageForContentType(contentType);
    this.setState({
      editorValue: get(currentStorage, 'value', ''),
      editorLanguage: get(currentStorage, 'language', 'javascript'),
    });
    loadCursorPosition(this.editor, this.props.activeEditorTab);
    this.editor.focus();
  };

  private updateAndApplyChanges = (contentType: ContentType) => {
    this.setValueForActiveTab(contentType);
    applyChangesToContent();
  };

  private handleEditorDidMount = (editor: CodeEditor) => {
    if (!this.editor) this.editor = editor;
    this.updateAndApplyChanges(this.props.activeEditorTab);
  };

  private handleResetClick = async () => {
    const { activeEditorTab } = this.props;
    await this.props.onResetActiveTabContents(activeEditorTab);
    this.updateAndApplyChanges(activeEditorTab);
  };

  private handleSaveAction = () => {
    const currentValue = this.editor.getValue();
    setStorageForContentType(this.props.activeEditorTab, {
      value: currentValue,
    });
    applyChangesToContent(this.props.activeEditorTab, currentValue);
  };

  private handleActiveEditorTabChange = (tabIndex: number) => {
    saveStateForContentType(this.editor, this.props.activeEditorTab);
    extrapolatePaths().then(() => {
      this.props.onUpdateActiveEditorTab(tabIndex);
      setTimeout(() => {
        this.setValueForActiveTab(tabIndex);
      });
    });
  };

  render() {
    return (
      <div className={this.props.className}>
        <Header
          activeTab={this.props.activeEditorTab}
          onResetClick={this.handleResetClick}
          onSaveClick={this.handleSaveAction}
          onTabClick={this.handleActiveEditorTabChange}
        />
        <Editor
          contentType={this.props.activeEditorTab}
          value={this.state.editorValue}
          language={this.state.editorLanguage}
          onEditorChange={editorValue => this.setState({ editorValue })}
          onEditorDidMount={this.handleEditorDidMount}
          onSaveKeysPressed={this.handleSaveAction}
          onUpdateTabKeysPressed={this.handleActiveEditorTabChange}
        />
        <svg
          width={36}
          className={css`
            position: absolute;
            left: -4px;
            bottom: 0;
            height: 104px;
          `}
        >
          <GoToBookmarkButton editor={this.editor} goTo="previous" />
          <GoToBookmarkButton editor={this.editor} goTo="next" />
        </svg>
        <ReactTooltip id="bookmarkNavTooltip" delayShow={500} />
      </div>
    );
  }
}

export default connect(
  (state: ReduxState) => ({
    activeEditorTab: selectActiveEditorTab(state),
  }),
  (dispatch: any) => ({
    onUpdateActiveEditorTab: contentType =>
      dispatch(updateActiveEditorTab(contentType)),
    onUpdateStorageForSlideNumber: slideNumber =>
      dispatch(updateStorageForSlideNumber(slideNumber)),
    onResetActiveTabContents: contentType =>
      dispatch(resetActiveTabContents(contentType)),
  }),
)(EditorColumnComponent);
