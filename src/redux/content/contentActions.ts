import { createAction } from 'redux-actions';
import { contentTypeArray, getCurrentSlideNumber } from '@utils/commonUtils';
import { setStorageForContentType } from '@utils/storageUtils';
import { ContentType } from '@customTypes/contentTypes';
import {
  selectContentValuesForReset,
  selectSlideValuesForSlideNumber,
} from './contentSelectors';
import { State } from '../reducers';
import datasets from './slides/datasets';
import slides from './slides/slides';

export const allSlidesContentLoaded = createAction(
  '@content/FETCH_ALL_SLIDES_CONTENT_LOADED',
  (datasets: any, slides: any) => ({ datasets, slides }),
);
export const updateActiveEditorTab = createAction(
  '@content/UPDATE_ACTIVE_EDITOR_TAB',
  (contentType: ContentType) => contentType,
);

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

const waitForContents = async () => {
  if (Object.keys(datasets).length !== 0 && Object.keys(slides).length !== 0) {
    return Promise.resolve();
  }
  if (!datasets || !slides) {
    setTimeout(() => {
      waitForContents();
    }, 250);
  }
};

export const initializeStorage = (): any => async (dispatch, getState) => {
  await waitForContents();
  dispatch(allSlidesContentLoaded(datasets, slides));
  const slideNumber = getCurrentSlideNumber();
  setTimeout(() => {
    populateStorageWithSlideContents(getState, slideNumber, {
      lineNumber: 1,
      columnNumber: 1,
    });
    return Promise.resolve();
  }, 1000);
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
