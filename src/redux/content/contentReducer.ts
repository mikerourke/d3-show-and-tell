import { handleActions, combineActions } from 'redux-actions';
import {
  allSlidesFetchStarted,
  allSlidesFetchSuccess,
  allSlidesFetchFailure,
  updateActiveEditorTab,
} from './contentActions';
import {
  ContentType,
  SlideValuesModel,
} from '../../types/contentTypes';

export interface ContentState {
  readonly activeEditorTab: ContentType;
  readonly datasetsByName: {
    [datasetName: string]: any;
  };
  readonly slideValuesBySlideNumber: {
    [slideNumber: string]: SlideValuesModel;
  };
  readonly isLoading: boolean;
}

export const initialState: ContentState = {
  activeEditorTab: ContentType.Code,
  datasetsByName: {},
  slideValuesBySlideNumber: {},
  isLoading: false,
};

const contentReducer = handleActions(
  {
    [allSlidesFetchSuccess.toString()]: (
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

    [allSlidesFetchStarted.toString()]: (state: ContentState) => ({
      ...state,
      isLoading: true,
    }),

    [combineActions(
      allSlidesFetchSuccess.toString(),
      allSlidesFetchFailure.toString(),
    ) as any]: (state: ContentState) => ({
      ...state,
      isLoading: false,
    }),
  },
  initialState,
);

export default contentReducer;
