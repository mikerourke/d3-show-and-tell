import * as monacoEditor from 'monaco-editor';
import { Dispatch } from 'redux-fixed';
import { State } from '@redux/reducers';

export interface BoxDimensions {
  width: number;
  height: number;
}

export enum Direction {
  Previous = 'previous',
  Next = 'next',
}

export type Monaco = typeof monacoEditor;
export type CodeEditor = monacoEditor.editor.IStandaloneCodeEditor;
export type EditorPosition = monacoEditor.IPosition;

export interface StorageRecord {
  position?: EditorPosition;
  language?: string;
  value?: string;
}

export type ReduxDispatch = Dispatch<any>;
export type ReduxState = State;
