import { handleActions } from 'redux-actions';
import {
  allSlidesContentLoaded,
  updateActiveEditorTab,
} from './contentActions';
import { ContentType, SlideValuesModel } from '../../types/contentTypes';

export interface ContentState {
  readonly activeEditorTab: ContentType;
  readonly datasetsByName: {
    [datasetName: string]: any;
  };
  readonly slideValuesBySlideNumber: {
    [slideNumber: string]: SlideValuesModel;
  };
}

export const initialState: ContentState = {
  activeEditorTab: ContentType.Code,
  datasetsByName: {},
  slideValuesBySlideNumber: {},
};

const contentReducer = handleActions(
  {
    [allSlidesContentLoaded.toString()]: (
      state: ContentState,
      { payload: { datasets, slides } }: any,
    ) => ({
      ...state,
      datasetsByName: datasets,
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
