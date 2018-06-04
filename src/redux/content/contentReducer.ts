import { handleActions, combineActions } from 'redux-actions';
import {
  allContentsFetchStarted,
  allContentsFetchSuccess,
  allContentsFetchFailure,
  allContentLoaded,
  updateCurrentCode,
  updateCurrentData,
  updateCurrentPaths,
  updateActiveEditorTab,
} from './contentActions';
import { ContentType } from '../../types/contentTypes';

export interface ContentState {
  readonly currentCode: string;
  readonly currentData: string | object;
  readonly currentPaths: string;
  readonly activeEditorTab: ContentType;
  readonly datasetsByName: any;
  readonly slidesBySlideNumber: any;
  readonly isLoading: boolean;
}

export const initialState: ContentState = {
  currentCode: '',
  currentData: '',
  currentPaths: '',
  activeEditorTab: ContentType.Code,
  datasetsByName: {},
  slidesBySlideNumber: {},
  isLoading: false,
};

const contentReducer = handleActions(
  {
    [allContentsFetchSuccess.toString()]: (
      state: ContentState,
      { payload: { datasets, slides } }: any,
    ) => ({
      ...state,
      datasetsByName: datasets,
      slidesBySlideNumber: slides,
    }),

    [allContentLoaded.toString()]: (
      state: ContentState,
      { payload: { code, data } }: any,
    ) => ({
      ...state,
      currentCode: code,
      currentData: JSON.stringify(data, null, '  '),
    }),

    [updateCurrentCode.toString()]: (
      state: ContentState,
      { payload: currentCode }: any,
    ) => ({
      ...state,
      currentCode,
    }),

    [updateCurrentData.toString()]: (
      state: ContentState,
      { payload: currentData }: any,
    ) => ({
      ...state,
      currentData,
    }),

    [updateCurrentPaths.toString()]: (
      state: ContentState,
      { payload: currentPaths }: any,
    ) => ({
      ...state,
      currentPaths,
    }),

    [updateActiveEditorTab.toString()]: (
      state: ContentState,
      { payload: contentType }: any,
    ) => ({
      ...state,
      activeEditorTab: contentType,
    }),

    [allContentsFetchStarted.toString()]: (state: ContentState) => ({
      ...state,
      isLoading: true,
    }),

    [combineActions(
      allContentsFetchSuccess.toString(),
      allContentsFetchFailure.toString(),
    ) as any]: (state: ContentState) => ({
      ...state,
      isLoading: false,
    }),
  },
  initialState,
);

export default contentReducer;
