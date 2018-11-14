import { createSelector } from 'reselect';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import {
  getCurrentSlideNumber,
  getNameForContentType,
} from '@utils/commonUtils';
import { ContentType, SlideTitleModel } from '@customTypes/content';
import { State } from '../reducers';

const selectDatasetsByName = createSelector(
  (state: State) => state.content.datasetsByName,
  datasetsByName => datasetsByName,
);

const selectSlideValuesBySlideNumber = createSelector(
  (state: State) => state.content.slideValuesBySlideNumber,
  slideValuesBySlideNumber => slideValuesBySlideNumber,
);

export const selectActiveEditorTab = (state: State) =>
  state.content.activeEditorTab;

export const selectSlideValuesForSlideNumber = createSelector(
  [selectDatasetsByName, selectSlideValuesBySlideNumber],
  (datasetsByName, slideValuesBySlideNumber) => (slideNumber: number) => {
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

export const selectSlideTitleRecords = createSelector(
  selectSlideValuesBySlideNumber,
  (slidesBySlideNumber): SlideTitleModel[] =>
    Object.values(slidesBySlideNumber).map(({ slideNumber, title }) => ({
      slideNumber,
      title,
    })),
);

export const selectCurrentSlideTitle = createSelector(
  [selectSlideTitleRecords, (_, slideNumber) => slideNumber],
  (slideTitleRecords, slideNumber): string => {
    const slideRecord = slideTitleRecords.find(
      slide => +slide.slideNumber === +slideNumber,
    );
    return slideRecord ? slideRecord.title : '';
  },
);
