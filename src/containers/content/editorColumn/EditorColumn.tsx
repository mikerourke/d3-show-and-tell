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
import {
  resetActiveTabContents,
  updateActiveEditorTab,
  updateStorageForSlideNumber,
} from '@redux/content/contentActions';
import { selectActiveEditorTab } from '@redux/content/contentSelectors';
import Editor from './components/Editor';
import GoToBookmarkButton from './components/GoToBookmarkButton';
import Header from './components/Header';
import {
  CodeEditor,
  Direction,
  ReduxDispatch,
  ReduxState,
} from '@customTypes/common';
import { ContentType } from '@customTypes/content';

interface ConnectStateProps {
  activeEditorTab: ContentType;
}

interface ConnectDispatchProps {
  onUpdateActiveEditorTab: (contentType: ContentType) => void;
  onUpdateStorageForSlideNumber: (slideNumber: number) => void;
  onResetActiveTabContents: (contentType: ContentType) => Promise<any>;
}

interface OwnProps {
  className: string;
  slideNumber: number;
}

type Props = ConnectStateProps & ConnectDispatchProps & OwnProps;

interface State {
  editorValue: string;
  editorLanguage: string;
}

/**
 * Connected container with editor and associated navigation components.
 * @param activeEditorTab Current active editor tab.
 * @param className CSS class to apply to component.
 * @param slideNumber Number of the currently active slide.
 * @param onUpdateActiveEditorTab Action to perform when the editor tab changes.
 * @param onUpdateStorageForSlideNumber Action to perform when storage update
 *    action is fired.
 * @param onResetActiveTabContents Action to perform when the reset action is
 *    fired.
 * @connected
 */
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

  /**
   * Updates the editor contents based on the active tab.
   * @param contentType Type of content associated with tab.
   */
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

  private handleEditorChange = (editorValue: string) => {
    this.setState({ editorValue });
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
          onEditorChange={this.handleEditorChange}
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
          <GoToBookmarkButton editor={this.editor} goTo={Direction.Previous} />
          <GoToBookmarkButton editor={this.editor} goTo={Direction.Next} />
        </svg>
        <ReactTooltip id="bookmarkNavTooltip" delayShow={500} />
      </div>
    );
  }
}

export default connect<ConnectStateProps, ConnectDispatchProps, OwnProps>(
  (state: ReduxState) => ({
    activeEditorTab: selectActiveEditorTab(state),
  }),
  (dispatch: ReduxDispatch) => ({
    onUpdateActiveEditorTab: contentType =>
      dispatch(updateActiveEditorTab(contentType)),
    onUpdateStorageForSlideNumber: slideNumber =>
      dispatch(updateStorageForSlideNumber(slideNumber)),
    onResetActiveTabContents: contentType =>
      dispatch(resetActiveTabContents(contentType)),
  }),
)(EditorColumnComponent);
