import { handleActions } from 'redux-actions';
import {
  allSlidesContentLoaded,
  updateActiveEditorTab,
} from './contentActions';
import {
  ContentType,
  DatasetsByName,
  SlideValuesModel,
} from '@customTypes/content';

export interface ContentState {
  readonly activeEditorTab: ContentType;
  readonly datasetsByName: DatasetsByName;
  readonly slideValuesBySlideNumber: Record<string, SlideValuesModel>;
}

export const initialState: ContentState = {
  activeEditorTab: ContentType.Code,
  datasetsByName: {
    stocks: [],
    scoreBySubject: [],
    countryScatter: [],
  },
  slideValuesBySlideNumber: {},
};

const contentReducer = handleActions(
  {
    [allSlidesContentLoaded.toString()]: (
      state: ContentState,
      { payload: { datasetsByName, slides } }: any,
    ) => ({
      ...state,
      datasetsByName,
      slideValuesBySlideNumber: slides,
    }),

    [updateActiveEditorTab.toString()]: (
      state: ContentState,
      { payload: contentType }: any,
    ) => ({
      ...state,
      activeEditorTab: contentType,
    }),
  },
  initialState,
);

export default contentReducer;
