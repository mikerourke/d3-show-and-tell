import { Dispatch } from 'redux';
import { createAction } from 'redux-actions';
import { getValidContent } from '@utils/codeUtils';
import { ContentType } from '@customTypes/contentTypes';
import { selectActiveEditorTab } from './contentSelectors';
import { GetState } from '../reducers';

export const codeFileFetchStarted = createAction(
  '@content/CODE_FILE_FETCH_STARTED',
);
export const codeFileFetchSuccess = createAction(
  '@content/CODE_FILE_FETCH_SUCCESS',
  (contents: any) => contents,
);
export const codeFileFetchFailure = createAction(
  '@content/CODE_FILE_FETCH_FAILURE',
);
export const dataFileFetchStarted = createAction(
  '@content/DATA_FILE_FETCH_STARTED',
);
export const dataFileFetchSuccess = createAction(
  '@content/DATA_FILE_FETCH_SUCCESS',
  (contents: any) => contents,
);
export const dataFileFetchFailure = createAction(
  '@content/DATA_FILE_FETCH_FAILURE',
);
export const allContentFetchStarted = createAction(
  '@content/ALL_CONTENT_FETCH_STARTED',
);
export const allContentFetchSuccess = createAction(
  '@content/ALL_CONTENT_FETCH_SUCCESS',
  (contents: any) => contents,
);
export const allContentFetchFailure = createAction(
  '@content/ALL_CONTENT_FETCH_FAILURE',
);
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
export const updateActiveEditorTab = createAction(
  '@content/UPDATE_ACTIVE_EDITOR_TAB',
  (contentType: ContentType) => contentType,
);

const performFetchByContentType = (
  contentType: ContentType,
  fileName: string,
) => {
  const folder = contentType === ContentType.Data ? 'data' : 'code';
  const extension = contentType === ContentType.Data ? 'json' : 'txt';
  const filePath = `./content/${folder}/${fileName}.${extension}`;
  return fetch(filePath)
    .then(
      (response: any) =>
        contentType === ContentType.Data ? response.json() : response.text(),
    )
    .catch(error => error);
};

export const fetchCodeFile = (fileName: string) => (
  dispatch: Dispatch<any>,
) => {
  dispatch(codeFileFetchStarted());
  return performFetchByContentType(ContentType.Code, fileName)
    .then(contents => codeFileFetchSuccess(contents))
    .catch(() => dispatch(codeFileFetchFailure()));
};

export const fetchDataFile = (fileName: string) => (
  dispatch: Dispatch<any>,
) => {
  dispatch(dataFileFetchStarted());
  return performFetchByContentType(ContentType.Data, fileName)
    .then(content => dataFileFetchSuccess(content))
    .catch(() => dispatch(dataFileFetchFailure()));
};

export const fetchAllContent = (fileName: string) => (
  dispatch: Dispatch<any>,
) => {
  dispatch(allContentFetchStarted());
  return Promise.all([
    performFetchByContentType(ContentType.Code, fileName),
    performFetchByContentType(ContentType.Data, fileName),
  ])
    .then(([code, data]) => dispatch(allContentFetchSuccess({ code, data })))
    .catch(() => dispatch(allContentFetchFailure()));
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
