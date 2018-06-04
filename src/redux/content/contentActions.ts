import { Dispatch } from 'redux';
import { createAction } from 'redux-actions';
import { getValidContent } from '@utils/codeUtils';
import { ContentType } from '@customTypes/contentTypes';
import {
  selectActiveEditorTab,
  selectSlideContentsForSlideNumber,
} from './contentSelectors';
import { GetState } from '../reducers';

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
export const allContentsFetchStarted = createAction(
  '@content/FETCH_ALL_STARTED',
);
export const allContentsFetchSuccess = createAction(
  '@content/FETCH_ALL_SUCCESS',
  (datasets: any, slides: any) => ({ datasets, slides }),
);
export const allContentsFetchFailure = createAction(
  '@content/FETCH_ALL_FAILURE',
);
export const allContentLoaded = createAction(
  '@content/ALL_CONTENT_LOADED',
  (content: any) => content,
);
export const updateActiveEditorTab = createAction(
  '@content/UPDATE_ACTIVE_EDITOR_TAB',
  (contentType: ContentType) => contentType,
);

const apiUrl = 'http://localhost:3000';

const fetchFile = (fileName: string) =>
  fetch(`${apiUrl}/content/${fileName}.json`)
    .then((response: any) => response.json())
    .catch(error => error);

export const fetchAllContents = () => dispatch => {
  dispatch(allContentsFetchStarted());
  const fileNames = ['datasets', 'slides'];
  return Promise.all(fileNames.map(fileName => fetchFile(fileName)))
    .then(([datasets, slides]) =>
      dispatch(allContentsFetchSuccess(datasets, slides)),
    )
    .catch(() => dispatch(allContentsFetchFailure()));
};

export const loadSlideContentsIntoCurrent = (slideNumber: string) => (
  dispatch: Dispatch<any>,
  getState: GetState,
) => {
  const { code, data } = selectSlideContentsForSlideNumber(
    getState(),
    slideNumber,
  );
  dispatch(allContentLoaded({ code, data }));
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
