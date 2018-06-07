import * as monacoEditor from 'monaco-editor';

export interface BoxDimensions {
  width: number;
  height: number;
}

export type Direction = 'previous' | 'next';

export interface StorageRecord {
  position?: monacoEditor.IPosition;
  language?: string;
  value?: string;
}

export type CodeEditor = monacoEditor.editor.IStandaloneCodeEditor;

export type Monaco = typeof monacoEditor;
