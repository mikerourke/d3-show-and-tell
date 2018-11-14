import { createAction } from 'redux-actions';
import { contentTypeArray, getCurrentSlideNumber } from '@utils/commonUtils';
import { setStorageForContentType } from '@utils/storageUtils';
import {
  selectContentValuesForReset,
  selectSlideValuesForSlideNumber,
} from './contentSelectors';
import firstSlide from './slides/firstSlide';
import datasets from './slides/datasets';
import slides from './slides/slides';
import { EditorPosition } from '@customTypes/common';
import {
  ContentType,
  DatasetsByName,
  SlideValuesModel,
} from '@customTypes/content';
import { Dispatch, GetState } from '../reducers';

export const allSlidesContentLoaded = createAction(
  '@content/ALL_SLIDES_CONTENT_LOADED',
  (
    datasetsByName: DatasetsByName,
    slides: Record<string, Partial<SlideValuesModel>>,
  ) => ({ datasetsByName, slides }),
);
export const updateActiveEditorTab = createAction(
  '@content/UPDATE_ACTIVE_EDITOR_TAB',
  (contentType: ContentType) => contentType,
);

/**
 * Pushes slide content to localStorage.
 * @param slideValues Content associated with a slide.
 * @param slideNumber Number of the slide.
 * @param position Cursor position associated with the slide's content type.
 */
const populateStorageWithSlideContents = (
  slideValues: SlideValuesModel,
  slideNumber: number,
  position?: EditorPosition,
) => {
  const { code, styles, data } = slideValues;
  const values = [code, styles, data, ''];
  const languages = ['javascript', 'css', 'json', 'javascript'];

  contentTypeArray.forEach(contentType => {
    setStorageForContentType(contentType, {
      position,
      value: values[contentType] as string,
      language: languages[contentType],
    });
  });
};

/**
 * Populates localStorage with all slide contents.
 */
export const initializeStorage = () => async (dispatch: Dispatch<any>) => {
  dispatch(allSlidesContentLoaded(datasets, slides));

  const slideNumber = getCurrentSlideNumber();
  const slideValues = {
    ...firstSlide,
    data: JSON.stringify(firstSlide.data),
  } as SlideValuesModel;

  populateStorageWithSlideContents(slideValues, slideNumber, {
    lineNumber: 1,
    column: 1,
  });
  return setTimeout(() => Promise.resolve(), 100);
};

/**
 * Syncs localStorage with the value of the active editor for the corresponding
 *    slide number.
 * @param slideNumber Slide number to update corresponding content.
 */
export const updateStorageForSlideNumber = (slideNumber: number) => (
  dispatch: Dispatch<any>,
  getState: GetState,
) => {
  const slideValues = selectSlideValuesForSlideNumber(getState())(slideNumber);
  populateStorageWithSlideContents(slideValues, slideNumber);
};

/**
 * Reverts the active tab's contents to the original value from the slide.
 * @param contentType Type of content to revert.
 */
export const resetActiveTabContents = (contentType: ContentType) => (
  dispatch: Dispatch<any>,
  getState: GetState,
) => {
  const resetValue = selectContentValuesForReset(getState(), contentType);
  setStorageForContentType(contentType, { value: resetValue });
  return Promise.resolve();
};
