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
    id: 'view-styles-content',
    label: 'View Styles',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KEY_2],
    run: () => onUpdateTabKeysPressed(ContentType.Styles),
  });

  editor.addAction({
    id: 'view-data-content',
    label: 'View Data',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KEY_3],
    run: () => onUpdateTabKeysPressed(ContentType.Data),
  });

  editor.addAction({
    id: 'view-paths-content',
    label: 'View Paths',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KEY_4],
    run: () => onUpdateTabKeysPressed(ContentType.Paths),
  });
};

const getStorageKeyByContentType = (contentType: ContentType) =>
  ({
    [ContentType.Code]: 'codeLinePosition',
    [ContentType.Styles]: 'stylesLinePosition',
    [ContentType.Data]: 'dataLinePosition',
    [ContentType.Paths]: 'pathsLinePosition',
  }[contentType]);

export const saveCursorPosition = (editor: any, previousTab: ContentType) => {
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

  editor.revealLineInCenter(lineNumber);
  editor.setPosition({ lineNumber, column });
};
