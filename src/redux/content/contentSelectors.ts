import { createSelector } from 'reselect';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import { State } from '../reducers';
import { ContentType, EditorContents } from '@customTypes/contentTypes';

const selectDatasetsByName = createSelector(
  (state: State) => state.content.datasetsByName,
  datasetsByName => datasetsByName,
);

const selectSlidesBySlideNumber = createSelector(
  (state: State) => state.content.slideValuesBySlideNumber,
  slideValuesBySlideNumber => slideValuesBySlideNumber,
);

export const selectActiveEditorTab = (state: State) =>
  state.content.activeEditorTab;

export const selectCurrentValues = createSelector(
  (state: State) => state.content.currentValuesByContentType,
  ({ code, styles, data, paths }) => {
    const validData = isString(data) ? data : JSON.stringify(data, null, ' ');

    return {
      code,
      styles,
      paths,
      data: validData,
    };
  },
);

export const selectEditorContents = createSelector(
  [selectCurrentValues, selectActiveEditorTab],
  ({ code, styles, data, paths }, activeEditorTab): EditorContents =>
    ({
      [ContentType.Code]: {
        language: 'javascript' as any,
        value: code,
      },
      [ContentType.Styles]: {
        language: 'css' as any,
        value: styles,
      },
      [ContentType.Data]: {
        language: 'json' as any,
        value: data,
      },
      [ContentType.Paths]: {
        language: 'javascript' as any,
        value: paths,
      },
    }[activeEditorTab]),
);

export const selectAreSlideValuesPresent = createSelector(
  [selectDatasetsByName, selectSlidesBySlideNumber],
  (datasetsByName, slideValuesBySlideNumber) =>
    !isEmpty(datasetsByName) && !isEmpty(slideValuesBySlideNumber),
);

export const selectSlideValuesForSlideNumber = createSelector(
  [
    selectDatasetsByName,
    selectSlidesBySlideNumber,
    (_, slideNumber) => slideNumber,
  ],
  (datasetsByName, slideValuesBySlideNumber, slideNumber) => {
    const slideValues = get(
      slideValuesBySlideNumber,
      slideNumber.toString(),
      null,
    );
    if (isNil(slideValues)) {
      return { title: '', code: '', styles: '', data: '' };
    }

    const { datasetName } = slideValues;
    const data = get(datasetsByName, datasetName, {});

    return { ...slideValues, data };
  },
);

export const selectSlideTitles = createSelector(
  selectSlidesBySlideNumber,
  slidesBySlideNumber =>
    Object.values(slidesBySlideNumber).map(({ slideNumber, title }) => ({
      slideNumber,
      title,
    })),
);

export const selectSlideTitleBySlideNumber = createSelector(
  [selectSlideTitles, (_, slideNumber) => slideNumber],
  (slideTitles, slideNumber) => {
    const slideRecord = slideTitles.find(
      slide => slide.slideNumber === slideNumber,
    );
    if (slideRecord) return slideRecord.title;
    return '';
  },
);

export const selectTotalSlideCount = createSelector(
  selectSlidesBySlideNumber,
  slidesBySlideNumber => Object.keys(slidesBySlideNumber).length,
);
