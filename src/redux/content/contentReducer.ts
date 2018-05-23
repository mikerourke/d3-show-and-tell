import { handleActions, combineActions } from 'redux-actions';
import {
  allContentFetchFailure,
  allContentFetchSuccess,
  allContentFetchStarted,
  codeFileFetchFailure,
  codeFileFetchSuccess,
  codeFileFetchStarted,
  dataFileFetchFailure,
  dataFileFetchSuccess,
  dataFileFetchStarted,
  updateCurrentCode,
  updateCurrentData,
  updateActiveEditorTab,
} from './contentActions';
import { ContentType } from '../../types/contentTypes';

export interface ContentState {
  readonly currentCode: string;
  readonly currentData: string | object;
  readonly activeEditorTab: ContentType;
  readonly isLoading: boolean;
}

export const initialState: ContentState = {
  currentCode: '',
  currentData: '',
  activeEditorTab: ContentType.Code,
  isLoading: false,
};

const contentReducer = handleActions(
  {
    [allContentFetchSuccess.toString()]: (
      state: ContentState,
      { payload: { code, data } }: any,
    ) => ({
      ...state,
      currentCode: code,
      currentData: data,
    }),

    [codeFileFetchSuccess.toString()]: (
      state: ContentState,
      { payload: currentCode }: any,
    ) => ({
      ...state,
      currentCode,
    }),

    [dataFileFetchSuccess.toString()]: (
      state: ContentState,
      { payload: currentData }: any,
    ) => ({
      ...state,
      currentData,
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

    [updateActiveEditorTab.toString()]: (
      state: ContentState,
      { payload: contentType }: any,
    ) => ({
      ...state,
      activeEditorTab: contentType,
    }),

    [combineActions(
      allContentFetchStarted.toString(),
      codeFileFetchStarted.toString(),
      dataFileFetchStarted.toString(),
    ) as any]: state => ({
      ...state,
      isLoading: true,
    }),

    [combineActions(
      allContentFetchSuccess.toString(),
      allContentFetchFailure.toString(),
      codeFileFetchSuccess.toString(),
      codeFileFetchFailure.toString(),
      dataFileFetchSuccess.toString(),
      dataFileFetchFailure.toString(),
    ) as any]: state => ({
      ...state,
      isLoading: false,
    }),
  },
  initialState,
);

export default contentReducer;
