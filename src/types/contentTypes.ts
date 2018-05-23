export enum ContentType {
  Code = 0,
  Data = 1,
}

export interface ContentModel {
  code: string;
  data: string;
}

export interface EditorContents {
  language: 'javascript' | 'json';
  value: string;
}
