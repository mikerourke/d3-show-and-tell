import * as store from 'store';
import { ContentType } from '@customTypes/contentTypes';

export const configureMonaco = (monaco: any) => {
  const compilerDefaults = {
    allowJs: true,
    allowNonTsExtensions: true,
    experimentalDecorators: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    jsxFactory: 'React.createElement',
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    noEmit: true,
    reactNamespace: 'React',
    target: monaco.languages.typescript.ScriptTarget.ES2016,
    typeRoots: ['node_modules/@types', './definitions'],
  };

  ['javascript', 'typescript'].forEach((languageName: string) => {
    const defaultsName = `${languageName}Defaults`;
    monaco.languages.typescript[defaultsName].setMaximumWorkerIdleTime(-1);
    monaco.languages.typescript[defaultsName].setCompilerOptions(
      compilerDefaults,
    );
    monaco.languages.typescript[defaultsName].setEagerModelSync(true);
    monaco.languages.typescript[defaultsName].setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
  });
};

export const addEditorActions = (editor: any, monaco: any, runActions: any) => {
  const { onSaveKeysPressed, onUpdateTabKeysPressed } = runActions;

  editor.addAction({
    id: 'save-and-update',
    label: 'Save and Update',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
    run: onSaveKeysPressed,
  });

  editor.addAction({
    id: 'view-code-content',
    label: 'View Code',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KEY_1],
    run: () => onUpdateTabKeysPressed(ContentType.Code),
  });

  editor.addAction({
    id: 'view-data-content',
    label: 'View Data',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KEY_2],
    run: () => onUpdateTabKeysPressed(ContentType.Data),
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
};

const getStorageKeyByContentType = (contentType: ContentType) =>
  ({
    [ContentType.Code]: 'codeLinePosition',
    [ContentType.Data]: 'dataLinePosition',
  }[contentType]);

export const saveCursorPosition = (
  editor: any,
  activeEditorTab: ContentType,
) => {
  const previousTab = activeEditorTab === ContentType.Code ? 1 : 0;
  const { lineNumber, column } = editor.getPosition();
  const storageKey = getStorageKeyByContentType(previousTab);
  store.set(storageKey, { lineNumber, column });
};

export const loadCursorPosition = (
  editor: any,
  activeEditorTab: ContentType,
) => {
  const storageKey = getStorageKeyByContentType(activeEditorTab);
  const { lineNumber, column } = store.get(storageKey) || {
    lineNumber: 1,
    column: 1,
  };

  // For some reason, the Code editor reveals the line 5 above, but the Data
  // editor reveals to the line 5 below.
  const increment = activeEditorTab === ContentType.Code ? -5 : 5;
  const lineToReveal = +lineNumber < 7 ? +lineNumber : +lineNumber + increment;
  editor.revealLine(lineToReveal);
  editor.setPosition({ lineNumber, column });
};
