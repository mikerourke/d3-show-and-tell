import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { injectGlobal } from 'styled-components';
import { elementHeights } from '../../constants';
import { BoxDimensions } from '../../types/commonTypes';
import { EditorContents } from '../../types/contentTypes';

interface Props {
  contents: EditorContents;
  onEditorChange: (newValue: any, event: any) => void;
  onSaveKeysPressed: () => void;
  onUpdateTabUpdateKeysPressed: (tabIndex: number) => void;
}

interface State {
  windowDimensions: BoxDimensions;
}

const MAX_HEIGHT = 928;

const getScreenDimensions = (): BoxDimensions => ({
  height: window.innerHeight,
  width: window.innerWidth,
});

injectGlobal`
  .monaco-editor {
    border: 2px solid #7fbbe3;
    max-height: ${MAX_HEIGHT}px;
    padding: 4px;
  }
`;

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

  editorDidMount = (editor: any, monaco: any) => {
    const { onSaveKeysPressed, onUpdateTabUpdateKeysPressed } = this.props;

    editor.addAction({
      id: 'save-and-update',
      label: 'Save and Update',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
      run: onSaveKeysPressed,
    });
    editor.addAction({
      id: 'view-code-content',
      label: 'View Code',
      keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KEY_0],
      run: () => onUpdateTabUpdateKeysPressed(0),
    });
    editor.addAction({
      id: 'view-data-content',
      label: 'View Data',
      keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KEY_1],
      run: () => onUpdateTabUpdateKeysPressed(1),
    });
    editor.addAction({
      id: 'delete-this-line',
      label: 'Delete Line',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_D],
      run(thisEditor: any) {
        thisEditor.trigger('keyboard', 'editor.action.deleteLines');
        return null;
      },
    });
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
      fontSize: 15,
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
      />
    );
  }
}

export default Editor;
