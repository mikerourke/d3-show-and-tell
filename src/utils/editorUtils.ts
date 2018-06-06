import * as store from 'store';
import get from 'lodash/get';
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

export const goToCommentOrComponent = (
  editor: any,
  direction: 'up' | 'down',
  skipToBlock: boolean,
) => {
  const { findFnName, startIncrement } = {
    up: {
      findFnName: 'findPreviousMatch',
      startIncrement: 0,
    },
    down: {
      findFnName: 'findNextMatch',
      startIncrement: 1,
    },
  }[direction];
  const { lineNumber } = editor.getPosition();

  const goToMatch = editor
    .getModel()
    [findFnName](
      skipToBlock ? /\/\/|\/\*/ : /<[a-zA-z]/,
      { column: 1, lineNumber: lineNumber + startIncrement },
      true,
      false,
      null,
      false,
    );
  const targetLineNumber = get(goToMatch, ['range', 'startLineNumber'], null);
  if (targetLineNumber) {
    editor.revealLineInCenter(targetLineNumber);
    editor.setPosition({ lineNumber: targetLineNumber, column: 1 });
    editor.focus();
  }
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
    id: 'go-to-previous-block',
    label: 'Go To Previous Block',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.PageUp],
    keybindingContext: null,
    contextMenuGroupId: 'blocks',
    contextMenuOrder: 1,
    run: () => goToCommentOrComponent(editor, 'up', true),
  });

  editor.addAction({
    id: 'go-to-next-block',
    label: 'Go To Next Block',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.PageDown],
    keybindingContext: null,
    contextMenuGroupId: 'blocks',
    contextMenuOrder: 2,
    run: () => goToCommentOrComponent(editor, 'down', true),
  });

  editor.addAction({
    id: 'go-to-previous-element',
    label: 'Go To Previous Element',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.US_OPEN_SQUARE_BRACKET],
    keybindingContext: null,
    run: () => goToCommentOrComponent(editor, 'up', false),
  });

  editor.addAction({
    id: 'go-to-next-element',
    label: 'Go To Next Element',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.US_CLOSE_SQUARE_BRACKET],
    keybindingContext: null,
    run: () => goToCommentOrComponent(editor, 'down', false),
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

export const resetAllCursorPositions = (editor: any) => {
  const resetPosition = { lineNumber: 1, column: 1 };
  [0, 1, 2, 3].forEach(contentType => {
    const storageKey = getStorageKeyByContentType(contentType);
    store.set(storageKey, resetPosition);
  });
  editor.revealLine(1);
  editor.setPosition(resetPosition);
};
