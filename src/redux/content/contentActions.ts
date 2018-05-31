import { Dispatch } from 'redux';
import { createAction } from 'redux-actions';
import { getValidContent } from '@utils/codeUtils';
import { ContentType } from '@customTypes/contentTypes';
import { selectActiveEditorTab } from './contentSelectors';
import { GetState } from '../reducers';
import chapterContents from './chapters/contents.json';
import chapterDatasets from './chapters/datasets.json';

export const updateCurrentCode = createAction(
  '@content/UPDATE_CURRENT_CODE',
  (code: string) => code,
);
export const updateCurrentData = createAction(
  '@content/UPDATE_CURRENT_DATA',
  (data: string | object) => data,
);
export const updateCurrentPaths = createAction(
  '@content/UPDATE_CURRENT_PATHS',
  (paths: string) => paths,
);
export const allContentLoaded = createAction(
  '@content/ALL_CONTENT_LOADED',
  (content: any) => content,
);
export const updateActiveEditorTab = createAction(
  '@content/UPDATE_ACTIVE_EDITOR_TAB',
  (contentType: ContentType) => contentType,
);

export const loadAllContentForSection = (sectionNumber: number) => (
  dispatch: Dispatch<any>,
) => {
  const { code, datasetName } = chapterContents['1'].sections['1'];
  dispatch(allContentLoaded({ code, data: chapterDatasets[datasetName] }));
};

export const updateCurrentContent = (newValue: string) => (
  dispatch: Dispatch<any>,
  getState: GetState,
) => {
  const activeEditorTab = selectActiveEditorTab(getState());

  if (activeEditorTab === ContentType.Code) {
    return dispatch(updateCurrentCode(newValue));
  }

  if (activeEditorTab === ContentType.Data) {
    const validContent = getValidContent(activeEditorTab, newValue);
    return dispatch(updateCurrentData(validContent));
  }

  if (activeEditorTab === ContentType.Paths) {
    return dispatch(updateCurrentPaths(newValue));
  }

  return Promise.resolve();
};
