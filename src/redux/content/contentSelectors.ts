import { createSelector } from 'reselect';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import { State } from '../reducers';
import { ContentType, EditorContents } from '@customTypes/contentTypes';

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

export const selectAllContent = createSelector(
  [selectCurrentCode, selectCurrentData, selectCurrentPaths],
  (currentCode, currentData, currentPaths) => ({
    code: currentCode,
    data: currentData,
    paths: currentPaths,
  }),
);

export const selectEditorContents = createSelector(
  [selectAllContent, selectActiveEditorTab],
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
