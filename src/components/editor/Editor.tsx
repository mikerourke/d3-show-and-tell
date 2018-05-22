import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { BoxDimensions } from '../../types/commonTypes';

interface Props {
  contents: string;
  dimensions: BoxDimensions;
  language: string;
  onEditorChange: (newValue: any, event: any) => void;
  onSaveKeysPressed: () => void;
  onSwapContents: () => void;
}

class Editor extends React.Component<Props> {
  editorDidMount = (editor: any, monaco: any) => {
    const { onSaveKeysPressed, onSwapContents } = this.props;
    editor.addAction({
      id: 'save-and-update',
      label: 'Save and Update',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
      precondition: null,
      keybindingContext: null,
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run() {
        onSaveKeysPressed();
        return null;
      },
    });
    editor.addAction({
      id: 'swap-contents',
      label: 'Swap Contents',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_Y],
      precondition: null,
      keybindingContext: null,
      run() {
        onSwapContents();
        return null;
      },
    });
    editor.focus();
  };

  render() {
    const { contents, dimensions, language, onEditorChange } = this.props;

    const options = {
      selectOnLineNumbers: true,
      fontFamily: '"Hack"',
      fontSize: 13,
      lineHeight: 26,
      fontLigatures: true,
      fontWeight: '300' as any,
      lineNumbers: 'on' as any,
      tabSize: 2,
      minimap: {
        enabled: false,
      },
    };

    return (
      <MonacoEditor
        width={dimensions.width}
        height={dimensions.height}
        language={language}
        theme="vs"
        value={contents}
        options={options}
        onChange={onEditorChange}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}

export default Editor;
