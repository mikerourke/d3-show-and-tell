import { createSelector } from 'reselect';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import { State } from '../reducers';
import { ContentType, EditorContents } from '../../types/contentTypes';

export const selectCurrentCode = (state: State) => state.content.currentCode;

export const selectCurrentData = (state: State) => {
  const currentData = get(state, ['content', 'currentData'], null);
  if (isNil(currentData)) return '';
  return isString(currentData)
    ? currentData
    : JSON.stringify(currentData, null, ' ');
};

export const selectActiveEditorTab = (state: State) =>
  state.content.activeEditorTab;

export const selectIsLoading = createSelector(
  [
    (state: State) => state.content.isLoading,
    selectCurrentCode,
    selectCurrentData,
  ],
  (isLoading, currentCode, currentData) =>
    isLoading || currentCode === '' || currentData === '',
);

export const selectAllContent = createSelector(
  [selectCurrentCode, selectCurrentData],
  (currentCode, currentData) => ({
    code: currentCode,
    data: currentData,
  }),
);

export const selectEditorContents = createSelector(
  [selectAllContent, selectActiveEditorTab],
  ({ code, data }, activeEditorTab): EditorContents =>
    ({
      [ContentType.Code]: {
        language: 'javascript' as any,
        value: code,
      },
      [ContentType.Data]: {
        language: 'json' as any,
        value: data,
      },
    }[activeEditorTab]),
);
