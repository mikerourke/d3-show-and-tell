import * as globalMonaco from 'monaco-editor';
import get from 'lodash/get';
import { ContentType } from '@customTypes/contentTypes';
import { CodeEditor, Direction, Monaco } from '@customTypes/commonTypes';
import {
  getStorageForContentType,
  setStorageForContentType,
  setStorageForAllContentTypes,
} from '@utils/storageUtils';

export const configureMonaco = (monaco: Monaco) => {
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

  const defaultsName = 'javascriptDefaults';
  monaco.languages.typescript[defaultsName].setMaximumWorkerIdleTime(-1);
  monaco.languages.typescript[defaultsName].setCompilerOptions(
    compilerDefaults,
  );
  monaco.languages.typescript[defaultsName].setEagerModelSync(true);
  monaco.languages.typescript[defaultsName].setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  });
};

export const goToBookmarkOrComponent = (
  editor: CodeEditor,
  direction: Direction,
  skipToBookmark: boolean,
) => {
  const { findFnName, startIncrement } = {
    previous: {
      findFnName: 'findPreviousMatch',
      startIncrement: 0,
    },
    next: {
      findFnName: 'findNextMatch',
      startIncrement: 1,
    },
  }[direction];
  const { lineNumber } = editor.getPosition();

  const goToMatch = editor
    .getModel()
    [findFnName](
      skipToBookmark ? /@bookmark/ : /<[a-zA-z]/,
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

export const highlightBookmarks = (editor: CodeEditor) => {
  const matches = editor
    .getModel()
    .findMatches('@bookmark', false, false, false, null, false);
  const foundRanges = matches.map(match => match.range);

  editorDecorations = editor.deltaDecorations(editorDecorations, [
    { range: new globalMonaco.Range(1, 1, 1, 1), options: {} },
  ]);

  const newDecorations = [];
  foundRanges.forEach(foundRange => {
    const {
      startLineNumber,
      startColumn,
      endLineNumber,
      endColumn,
    } = foundRange;

    const range = new globalMonaco.Range(
      startLineNumber,
      startColumn,
      endLineNumber,
      endColumn,
    );
    const options = {
      isWholeLine: true,
      className: 'editorLineHighlight',
      glyphMarginClassName: 'editorGlyphMargin',
    };
    newDecorations.push({ range, options });
  });

  editorDecorations = editor.deltaDecorations(
    editorDecorations,
    newDecorations,
  );
};

export const addEditorActions = (
  editor: CodeEditor,
  monaco: Monaco,
  runActions: any,
) => {
  const { onSaveKeysPressed, onUpdateTabKeysPressed } = runActions;

  editor.addAction({
    id: 'save-and-update',
    label: 'Save and Update',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
    run: onSaveKeysPressed,
  });

  editor.addAction({
    id: 'go-to-previous-bookmark',
    label: 'Go To Previous Bookmark',
    keybindings: [monaco.KeyMod.Shift | monaco.KeyCode.F5],
    keybindingContext: null,
    contextMenuGroupId: 'bookmarks',
    contextMenuOrder: 1,
    run: () => goToBookmarkOrComponent(editor, 'previous', true),
  });

  editor.addAction({
    id: 'go-to-next-bookmark',
    label: 'Go To Next Bookmark',
    keybindings: [monaco.KeyCode.F5],
    keybindingContext: null,
    contextMenuGroupId: 'bookmarks',
    contextMenuOrder: 2,
    run: () => goToBookmarkOrComponent(editor, 'next', true),
  });

  editor.addAction({
    id: 'go-to-previous-element',
    label: 'Go To Previous Element',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.US_OPEN_SQUARE_BRACKET],
    keybindingContext: null,
    run: () => goToBookmarkOrComponent(editor, 'previous', false),
  });

  editor.addAction({
    id: 'go-to-next-element',
    label: 'Go To Next Element',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.US_CLOSE_SQUARE_BRACKET],
    keybindingContext: null,
    run: () => goToBookmarkOrComponent(editor, 'next', false),
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

export const saveStateForContentType = (
  editor: CodeEditor,
  contentType: ContentType,
) => {
  const position = editor.getPosition();
  const value = editor.getValue();
  setStorageForContentType(contentType, { position, value });
};

export const loadCursorPosition = (
  editor: CodeEditor,
  contentType: ContentType,
) => {
  const storedState = getStorageForContentType(contentType);
  const lineNumber = get(storedState, ['position', 'lineNumber'], 1);
  const column = get(storedState, ['position', 'column'], 1);
  setTimeout(() => {
    editor.revealLineInCenter(lineNumber);
    editor.setPosition({ lineNumber, column });
  }, 0);
};

export const resetAllCursorPositions = (editor: CodeEditor) => {
  const resetPosition = { lineNumber: 1, column: 1 };
  setStorageForAllContentTypes({ position: resetPosition });
  editor.revealLine(1);
  editor.setPosition(resetPosition);
};
