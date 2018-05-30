export enum ContentType {
  Code = 0,
  Data = 1,
  Paths = 2,
}

export interface ContentModel {
  code: string;
  data: string;
  paths: string;
}

export interface EditorContents {
  language: 'javascript' | 'json';
  value: string;
}
