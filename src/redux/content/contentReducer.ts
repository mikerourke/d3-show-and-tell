import { handleActions } from 'redux-actions';
import {
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
}

export const initialState: ContentState = {
  currentCode: '',
  currentData: '',
  currentPaths: '',
  activeEditorTab: ContentType.Code,
};

const contentReducer = handleActions(
  {
    [allContentLoaded.toString()]: (
      state: ContentState,
      { payload: { code, data } }: any,
    ) => ({
      ...state,
      currentCode: code,
      currentData: JSON.stringify(data, null, '  '),
      currentPaths: '',
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
  },
  initialState,
);

export default contentReducer;
