import { createAction } from 'redux-actions';
import { contentTypeArray, getCurrentSlideNumber } from '@utils/commonUtils';
import { setStorageForContentType } from '@utils/storageUtils';
import { ContentType } from '@customTypes/contentTypes';
import {
  selectContentValuesForReset,
  selectSlideValuesForSlideNumber,
} from './contentSelectors';
import firstSlide from './slides/firstSlide';
import datasets from './slides/datasets';
import slides from './slides/slides';

export const allSlidesContentLoaded = createAction(
  '@content/ALL_SLIDES_CONTENT_LOADED',
  (datasets: any, slides: any) => ({ datasets, slides }),
);
export const updateActiveEditorTab = createAction(
  '@content/UPDATE_ACTIVE_EDITOR_TAB',
  (contentType: ContentType) => contentType,
);

const populateStorageWithSlideContents = (
  slideValues: any,
  slideNumber: number,
  position?: any,
) => {
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

export const initializeStorage = (): any => async dispatch => {
  dispatch(allSlidesContentLoaded(datasets, slides));
  const slideNumber = getCurrentSlideNumber();
  const slideValues = { ...firstSlide, data: JSON.stringify(firstSlide.data) };
  populateStorageWithSlideContents(slideValues, slideNumber, {
    lineNumber: 1,
    columnNumber: 1,
  });
  return setTimeout(() => Promise.resolve(), 100);
};

export const updateStorageForSlideNumber = (slideNumber: number): any => (
  dispatch,
  getState,
) => {
  const slideValues = selectSlideValuesForSlideNumber(getState())(slideNumber);
  populateStorageWithSlideContents(slideValues, slideNumber);
};

export const resetActiveTabContents = (contentType: ContentType): any => (
  dispatch,
  getState,
) => {
  const resetValue = selectContentValuesForReset(getState(), contentType);
  setStorageForContentType(contentType, { value: resetValue });
  return Promise.resolve();
};
