import React from 'react';
import { default as MonacoEditor } from 'react-monaco-editor';
import { elementHeights } from '@constants';
import { configureMonaco, addEditorActions } from '@utils/editorUtils';
import { BoxDimensions, CodeEditor, Monaco } from '@customTypes/common';
import { ContentType } from '@customTypes/content';

interface Props {
  contentType: ContentType;
  language: string;
  value: string;
  onEditorDidMount: (editor: CodeEditor) => void;
  onEditorChange: (newValue: any, event: any) => void;
  onSaveKeysPressed: (editor: CodeEditor) => void;
  onUpdateTabKeysPressed: (tabIndex: number) => void;
}

interface State {
  windowDimensions: BoxDimensions;
}

/**
 * Returns the current window inner dimensions.
 */
const getScreenDimensions = (): BoxDimensions => ({
  height: window.innerHeight,
  width: window.innerWidth,
});

/**
 * Monaco editor instance used to manipulate code (left column).
 * @param contentType Type of content displayed in editor.
 * @param language Programming language to use.
 * @param value Contents of the editor.
 * @param onEditorDidMount Action to perform when the editor component mounts.
 * @param onEditorChange Action to perform when the editor content changes.
 * @param onSaveKeysPressed Action to perform when the save keys are pressed.
 * @param onUpdateTabKeysPressed Action to perform when the keyboard shortcut
 *    to update the active tab is pressed.
 */
export default class Editor extends React.Component<Props, State> {
  state = {
    windowDimensions: getScreenDimensions(),
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateScreenDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateScreenDimensions);
  }

  updateScreenDimensions = () => {
    this.setState({ windowDimensions: getScreenDimensions() });
  };

  editorWillMount = (monaco: any) => {
    configureMonaco(monaco);
  };

  editorDidMount = (editor: CodeEditor, monaco: Monaco) => {
    this.props.onEditorDidMount(editor);
    addEditorActions(editor, monaco, this.props);
    editor.getModel().updateOptions({ tabSize: 2 });
    editor.focus();
  };

  /**
   * Calculate the new dimensions of the editor based on the window inner height
   *   and width.
   */
  getEditorDimensions = (): BoxDimensions => {
    const { height, width } = this.state.windowDimensions;
    const { APP_HEADER, COLUMN_HEADER, EDITOR_TABS } = elementHeights;

    const MAX_HEIGHT = 928;
    const heightSubtractor = APP_HEADER + COLUMN_HEADER + EDITOR_TABS + 64;
    const calculatedHeight = height - heightSubtractor;

    return {
      height: calculatedHeight <= MAX_HEIGHT ? calculatedHeight : MAX_HEIGHT,
      width: width / 2 - 32,
    };
  };

  render() {
    const { height, width } = this.getEditorDimensions();

    const options = {
      selectOnLineNumbers: true,
      fontFamily: '"Roboto Mono"',
      fontSize: 14,
      lineHeight: 26,
      fontLigatures: true,
      fontWeight: '300' as any,
      lineNumbers: 'on' as any,
      tabSize: 2,
      minimap: {
        enabled: true,
      },
      glyphMargin: true,
    };

    return (
      <MonacoEditor
        height={height}
        width={width}
        language={this.props.language}
        theme="vs"
        value={this.props.value}
        options={options}
        onChange={this.props.onEditorChange}
        editorDidMount={this.editorDidMount}
        editorWillMount={this.editorWillMount}
      />
    );
  }
}
