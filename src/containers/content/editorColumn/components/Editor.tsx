import React from 'react';
import { default as MonacoEditor } from 'react-monaco-editor';
import { elementHeights } from '@constants';
import { configureMonaco, addEditorActions } from '@utils/editorUtils';
import { BoxDimensions, CodeEditor, Monaco } from '@customTypes/commonTypes';
import { ContentType } from '@customTypes/contentTypes';

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

const MAX_HEIGHT = 928;

const getScreenDimensions = (): BoxDimensions => ({
  height: window.innerHeight,
  width: window.innerWidth,
});

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

  getEditorDimensions = (): any => {
    const { height, width } = this.state.windowDimensions;
    const { APP_HEADER, COLUMN_HEADER, EDITOR_TABS } = elementHeights;
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
