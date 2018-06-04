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
  (state: State) => state.content.slidesBySlideNumber,
  slidesBySlideNumber => slidesBySlideNumber,
);

export const selectIsLoading = (state: State) => state.content.isLoading;

export const selectCurrentCode = (state: State) => state.content.currentCode;

export const selectCurrentPaths = (state: State) => state.content.currentPaths;

export const selectCurrentData = (state: State) => {
  const currentData = get(state, ['content', 'currentData'], null);
  if (isNil(currentData)) return '';
  return isString(currentData)
    ? currentData
    : JSON.stringify(currentData, null, ' ');
};

export const selectActiveEditorTab = (state: State) =>
  state.content.activeEditorTab;

export const selectCurrentContent = createSelector(
  [selectCurrentCode, selectCurrentData, selectCurrentPaths],
  (currentCode, currentData, currentPaths) => ({
    code: currentCode,
    data: currentData,
    paths: currentPaths,
  }),
);

export const selectEditorContents = createSelector(
  [selectCurrentContent, selectActiveEditorTab],
  ({ code, data, paths }, activeEditorTab): EditorContents =>
    ({
      [ContentType.Code]: {
        language: 'javascript' as any,
        value: code,
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

export const selectIsSlideContentPresent = createSelector(
  [selectDatasetsByName, selectSlidesBySlideNumber],
  (datasetsByName, slidesBySlideNumber) =>
    !isEmpty(datasetsByName) && !isEmpty(slidesBySlideNumber),
);

export const selectSlideContentsForSlideNumber = createSelector(
  [
    selectDatasetsByName,
    selectSlidesBySlideNumber,
    (_, slideNumber) => slideNumber,
  ],
  (datasetsByName, slidesBySlideNumber, slideNumber) => {
    const slideData = get(slidesBySlideNumber, slideNumber.toString(), null);
    if (isNil(slideData)) return { title: '', code: '', data: '' };

    const { title, code, datasetName } = slideData;
    const data = get(datasetsByName, datasetName, {});

    return {
      title,
      code,
      data,
    };
  },
);
