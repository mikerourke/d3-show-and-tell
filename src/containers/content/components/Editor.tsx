import React from 'react';
import { default as MonacoEditor } from 'react-monaco-editor';
import { elementHeights } from '@constants';
import { BoxDimensions } from '@customTypes/commonTypes';
import { EditorContents } from '@customTypes/contentTypes';
import { configureMonaco, addEditorActions } from '@utils/editorUtils';

interface Props {
  contents: EditorContents;
  onEditorDidMount: (editor: any) => void;
  onEditorChange: (newValue: any, event: any) => void;
  onSaveKeysPressed: (editor: any) => void;
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

class Editor extends React.Component<Props, State> {
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

  editorDidMount = (editor: any, monaco: any) => {
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
    const { contents, onEditorChange } = this.props;
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
    };

    return (
      <MonacoEditor
        height={height}
        width={width}
        language={contents.language}
        theme="vs"
        value={contents.value}
        options={options}
        onChange={onEditorChange}
        editorDidMount={this.editorDidMount}
        editorWillMount={this.editorWillMount}
      />
    );
  }
}

export default Editor;
