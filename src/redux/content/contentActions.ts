import { createAction } from 'redux-actions';
import { contentTypeArray, getCurrentSlideNumber } from '@utils/commonUtils';
import { setStorageForContentType } from '@utils/storageUtils';
import { ContentType } from '@customTypes/contentTypes';
import {
  selectContentValuesForReset,
  selectSlideValuesForSlideNumber,
} from './contentSelectors';
import { State } from '../reducers';
import { API_URL } from '@constants';

export const allSlidesFetchStarted = createAction(
  '@content/FETCH_ALL_SLIDES_STARTED',
);
export const allSlidesFetchSuccess = createAction(
  '@content/FETCH_ALL_SLIDES_SUCCESS',
  (datasets: any, slides: any) => ({ datasets, slides }),
);
export const allSlidesFetchFailure = createAction(
  '@content/FETCH_ALL_SLIDES_FAILURE',
);
export const updateActiveEditorTab = createAction(
  '@content/UPDATE_ACTIVE_EDITOR_TAB',
  (contentType: ContentType) => contentType,
);

const fetchFile = (fileName: string) =>
  fetch(`${API_URL}/content/${fileName}.json`)
    .then((response: any) => response.json())
    .catch(error => error);

export const fetchAllSlideContents = (): any => dispatch => {
  dispatch(allSlidesFetchStarted());
  const fileNames = ['datasets', 'slides'];
  return Promise.all(fileNames.map(fileName => fetchFile(fileName)))
    .then(([datasets, slides]) =>
      dispatch(allSlidesFetchSuccess(datasets, slides)),
    )
    .catch(() => dispatch(allSlidesFetchFailure()));
};

const populateStorageWithSlideContents = (
  getState: () => State,
  slideNumber: number,
  position?: any,
) => {
  const slideValues = selectSlideValuesForSlideNumber(getState())(slideNumber);
  const { code, styles, data } = slideValues;
  const values = [code, styles, data, ''];
  const languages = ['javascript', 'css', 'json', 'javascript'];

  contentTypeArray.forEach(contentType => {
    setStorageForContentType(contentType, {
      position,
      value: values[contentType] as any,
      language: languages[contentType],
    });
  });
};

export const initializeStorage = (): any => async (dispatch, getState) => {
  await dispatch(fetchAllSlideContents());
  const slideNumber = getCurrentSlideNumber();
  populateStorageWithSlideContents(getState, slideNumber, {
    lineNumber: 1,
    columnNumber: 1,
  });
};

export const updateStorageForSlideNumber = (slideNumber: number): any => (
  dispatch,
  getState,
) => {
  populateStorageWithSlideContents(getState, slideNumber);
};

export const resetActiveTabContents = (contentType: ContentType): any => (
  dispatch,
  getState,
) => {
  const resetValue = selectContentValuesForReset(getState(), contentType);
  setStorageForContentType(contentType, { value: resetValue });
  return Promise.resolve();
};
