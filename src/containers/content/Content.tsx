import React from 'react';
import { Columns, Column } from 'bloomer';
import { css } from 'emotion';
import { connect } from 'react-redux';
import {
  appendSharedCodeScriptToPage,
  populateAndExecuteCode,
  appendCustomStyleToPage,
} from '@utils/codeUtils';
import { loadCursorPosition, saveCursorPosition } from '@utils/editorUtils';
import {
  getPathComponentsFromContents,
  updatePathsFromChanges,
} from '@utils/svgPathUtils';
import {
  fetchAllSlideContents,
  setCurrentValuesToSlideValues,
  updateActiveEditorTab,
  updateCurrentValueForContentType,
} from '@redux/content/contentActions';
import {
  selectActiveEditorTab,
  selectCurrentValues,
  selectEditorContents,
  selectAreSlideValuesPresent,
  selectSlideValuesForSlideNumber,
} from '@redux/content/contentSelectors';
import { State as ReduxState } from '@redux/reducers';
import {
  CurrentValuesModel,
  ContentType,
  EditorContents,
} from '@customTypes/contentTypes';
import Editor from './components/Editor';
import EditorHeader from './components/EditorHeader';
import BlockNavigationButtons from '@containers/content/components/BlockNavigationButtons';

interface StateProps {
  activeEditorTab: ContentType;
  editorContents: EditorContents;
  currentValues: CurrentValuesModel;
  isSlideContentPresent: boolean;
  slideValues: any;
  slideNumber: number;
}

interface DispatchProps {
  onFetchAllContents: () => Promise<any>;
  onSetCurrentValuesToSlideValues: (contentType?: ContentType) => void;
  onUpdateActiveEditorTab: (contentType: ContentType) => void;
  onUpdateCurrentValueForContentType: (
    contentType: ContentType,
    newValue: string,
  ) => void;
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
  editor: any;

  constructor(props: Props) {
    super(props);
    this.editor = null;
    this.state = {
      tabsShown: {
        [ContentType.Code]: true,
        [ContentType.Styles]: true,
        [ContentType.Data]: false,
        [ContentType.Paths]: false,
      },
    };
    this.initializeContent();
  }

  componentDidMount() {
    this.updatePaths();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.activeEditorTab !== this.props.activeEditorTab) {
      loadCursorPosition(this.editor, this.props.activeEditorTab);
      this.editor.focus();
    }

    if (prevProps.slideNumber !== this.props.slideNumber) {
      this.populateContentFromSlide();
    }
  }

  initializeContent = async () => {
    if (!this.props.isSlideContentPresent) {
      await this.props.onFetchAllContents();
    }

    this.populateContentFromSlide();
  };

  populateContentFromSlide = () => {
    this.props.onSetCurrentValuesToSlideValues();

    setTimeout(() => {
      appendSharedCodeScriptToPage();
      this.updateScriptContents();
      const hasData = !/{}/g.test(this.props.currentValues.data.toString());
      this.updateTabsShown(ContentType.Data, hasData);
      this.updatePaths();
    }, 0);
  };

  updatePaths = () => {
    setTimeout(() => {
      const paths = getPathComponentsFromContents();
      this.props.onUpdateCurrentValueForContentType(ContentType.Paths, paths);
      this.updateTabsShown(ContentType.Paths, paths !== null);
    }, 1000);
  };

  updateTabsShown = (contentType: ContentType, isShown: boolean) =>
    this.setState(state => ({
      tabsShown: {
        ...state.tabsShown,
        [contentType]: isShown,
      },
    }));

  updateScriptContents = () => {
    const { code, styles, data } = this.props.currentValues;
    appendCustomStyleToPage(styles);
    populateAndExecuteCode(code, data);
  };

  handleEditorDidMount = (editor: any) => {
    if (!this.editor) this.editor = editor;
  };

  handleActiveEditorTabChange = (tabIndex: number) => {
    if (!this.state.tabsShown[tabIndex]) return;
    saveCursorPosition(this.editor, this.props.activeEditorTab);
    this.props.onUpdateActiveEditorTab(tabIndex);
  };

  handleEditorChange = (newValue: string) => {
    const { activeEditorTab, onUpdateCurrentValueForContentType } = this.props;
    onUpdateCurrentValueForContentType(activeEditorTab, newValue);
  };

  handleSaveAction = () => {
    const { activeEditorTab, onUpdateCurrentValueForContentType } = this.props;
    if (activeEditorTab === ContentType.Paths) {
      const editorValue = this.editor.getValue();
      updatePathsFromChanges(editorValue);
      onUpdateCurrentValueForContentType(activeEditorTab, editorValue);
    } else {
      this.updateScriptContents();
      setTimeout(() => {
        const paths = getPathComponentsFromContents();
        this.props.onUpdateCurrentValueForContentType(ContentType.Paths, paths);
      }, 0);
    }
  };

  handleResetClick = () => {
    const { activeEditorTab, onSetCurrentValuesToSlideValues } = this.props;
    onSetCurrentValuesToSlideValues(activeEditorTab);
    setTimeout(() => {
      this.handleSaveAction();
      this.editor.trigger('keyboard', 'editor.action.formatDocument');
    }, 0);
  };

  render() {
    return (
      <Columns
        className={css`
          margin: 8px;
        `}
      >
        <Column
          className={css`
            position: relative;
          `}
        >
          <EditorHeader
            activeTab={this.props.activeEditorTab}
            tabsShown={this.state.tabsShown}
            onResetClick={this.handleResetClick}
            onSaveClick={this.handleSaveAction}
            onTabClick={this.handleActiveEditorTabChange}
          />
          <Editor
            contents={this.props.editorContents}
            onEditorDidMount={this.handleEditorDidMount}
            onEditorChange={this.handleEditorChange}
            onSaveKeysPressed={this.handleSaveAction}
            onUpdateTabKeysPressed={this.handleActiveEditorTabChange}
          />
          <BlockNavigationButtons editor={this.editor} />
        </Column>
        <Column>
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
    currentValues: selectCurrentValues(state),
    isSlideContentPresent: selectAreSlideValuesPresent(state),
    slideValues: selectSlideValuesForSlideNumber(state, slideNumber),
    slideNumber: +slideNumber,
  }),
  (
    dispatch: any,
    {
      match: {
        params: { slideNumber },
      },
    }: OwnProps,
  ) => ({
    onFetchAllContents: () => dispatch(fetchAllSlideContents()),
    onSetCurrentValuesToSlideValues: contentType =>
      dispatch(setCurrentValuesToSlideValues(slideNumber, contentType)),
    onUpdateActiveEditorTab: contentType =>
      dispatch(updateActiveEditorTab(contentType)),
    onUpdateCurrentValueForContentType: (contentType, newValue) =>
      dispatch(updateCurrentValueForContentType(contentType, newValue)),
  }),
)(ContentComponent);
