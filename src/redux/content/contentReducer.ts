import { handleActions, combineActions } from 'redux-actions';
import {
  allSlidesFetchStarted,
  allSlidesFetchSuccess,
  allSlidesFetchFailure,
  allCurrentValuesUpdated,
  updateCurrentValue,
  updateActiveEditorTab,
} from './contentActions';
import {
  ContentType,
  CurrentValuesModel,
  SlideValuesModel,
} from '../../types/contentTypes';

export interface ContentState {
  readonly currentValuesByContentType: CurrentValuesModel;
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
  currentValuesByContentType: {
    code: '',
    styles: '',
    data: '',
    paths: '',
  },
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

    [allCurrentValuesUpdated.toString()]: (
      state: ContentState,
      { payload: { code, styles, data } }: any,
    ) => ({
      ...state,
      currentValuesByContentType: {
        ...state.currentValuesByContentType,
        code,
        styles,
        data: JSON.stringify(data, null, '  '),
      },
    }),

    [updateCurrentValue.toString()]: (
      state: ContentState,
      { payload: { contentType, newValue } }: any,
    ) => {
      const contentTypeKey = ['code', 'styles', 'data', 'paths'][contentType];
      return {
        ...state,
        currentValuesByContentType: {
          ...state.currentValuesByContentType,
          [contentTypeKey]: newValue,
        },
      };
    },

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
