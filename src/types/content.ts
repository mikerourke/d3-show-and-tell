export enum ContentType {
  Code = 0,
  Styles = 1,
  Data = 2,
  Paths = 3,
}

export interface CurrentValuesModel {
  code: string;
  styles: string;
  data: string | object;
  paths: string;
}

export interface SlideValuesModel {
  slideNumber: number;
  title: string;
  code: string;
  styles: string;
  datasetName: string;
  data: string;
}

export interface EditorContents {
  language: 'javascript' | 'json';
  value: string;
}

export interface StocksDatasetModel {
  ticker: string;
  values: { date: string; close: number }[];
}

export interface ScoreBySubjectDatasetModel {
  score: number;
  subject: string;
}

export interface CountryScatterDatasetModel {
  country: string;
  population: number;
  expectancy: number;
  cost: number;
  code: string;
}

export interface DatasetsByName {
  stocks: StocksDatasetModel[];
  scoreBySubject: ScoreBySubjectDatasetModel[];
  countryScatter: CountryScatterDatasetModel[];
}

export interface SlideTitleModel {
  slideNumber: number;
  title: string;
}
