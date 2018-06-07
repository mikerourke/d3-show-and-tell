import { createSelector } from 'reselect';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import {
  getCurrentSlideNumber,
  getNameForContentType,
} from '@utils/commonUtils';
import { State } from '../reducers';
import { ContentType } from '@customTypes/contentTypes';

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

export const selectSlideValuesForSlideNumber = createSelector(
  [selectDatasetsByName, selectSlidesBySlideNumber],
  (datasetsByName, slideValuesBySlideNumber) => slideNumber => {
    const slideValues = get(
      slideValuesBySlideNumber,
      slideNumber.toString(),
      null,
    );
    if (isNil(slideValues)) {
      return { title: '', code: '', styles: '', data: '' };
    }

    const { datasetName } = slideValues;
    const datasetData = get(datasetsByName, datasetName, {});
    const data = JSON.stringify(datasetData, null, '  ');

    return { ...slideValues, data };
  },
);

export const selectContentValuesForReset = createSelector(
  [selectSlideValuesForSlideNumber, (_, contentType) => contentType],
  (getSlideValuesForSlideNumber, contentType) => {
    const contentTypeName = getNameForContentType(contentType).toLowerCase();
    const slideNumber = getCurrentSlideNumber();
    const slideValues = getSlideValuesForSlideNumber(slideNumber);
    if (contentType === ContentType.Paths) return '';
    return get(slideValues, contentTypeName, '');
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

// export const selectCurrentSlideDetails = createSelector(
//   selectSlideTitles,
//   slideTitles => {
//     const slideNumber = getCurrentSlideNumber();
//     const slideRecord = slideTitles.find(
//       slide => slide.slideNumber === slideNumber,
//     );
//     const slideTitle = slideRecord ? slideRecord.title : '';
//     return {
//       slideTitle,
//       slideNumber,
//     };
//   },
// );

export const selectCurrentSlideTitle = createSelector(
  [selectSlideTitles, (_, slideNumber) => slideNumber],
  (slideTitles, slideNumber) => {
    const slideRecord = slideTitles.find(
      slide => +slide.slideNumber === +slideNumber,
    );
    return slideRecord ? slideRecord.title : '';
  },
);
