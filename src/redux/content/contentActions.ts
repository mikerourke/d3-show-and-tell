import { Dispatch } from 'redux';
import { createAction } from 'redux-actions';
import { getValidContent } from '@utils/codeUtils';
import { ContentType } from '@customTypes/contentTypes';
import { selectSlideValuesForSlideNumber } from './contentSelectors';
import { GetState } from '../reducers';

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
export const updateCurrentValue = createAction(
  '@content/UPDATE_CURRENT_VALUE',
  (contentType: ContentType, newValue: string) => ({ contentType, newValue }),
);
export const allCurrentValuesUpdated = createAction(
  '@content/ALL_CURRENT_VALUES_UPDATED',
  (values: any) => values,
);
export const updateActiveEditorTab = createAction(
  '@content/UPDATE_ACTIVE_EDITOR_TAB',
  (contentType: ContentType) => contentType,
);

const apiUrl = 'http://localhost:3000';

const fetchFile = (fileName: string) =>
  fetch(`${apiUrl}/content/${fileName}.json`)
    .then((response: any) => response.json())
    .catch(error => error);

export const fetchAllSlideContents = () => dispatch => {
  dispatch(allSlidesFetchStarted());
  const fileNames = ['datasets', 'slides'];
  return Promise.all(fileNames.map(fileName => fetchFile(fileName)))
    .then(([datasets, slides]) =>
      dispatch(allSlidesFetchSuccess(datasets, slides)),
    )
    .catch(() => dispatch(allSlidesFetchFailure()));
};

export const setCurrentValuesToSlideValues = (
  slideNumber: string,
  contentType: ContentType | null = null,
) => (dispatch: Dispatch<any>, getState: GetState) => {
  const { code, data, styles } = selectSlideValuesForSlideNumber(
    getState(),
    slideNumber,
  );

  if (contentType === null) {
    return dispatch(allCurrentValuesUpdated({ code, styles, data }));
  }

  const valueToUse = {
    [ContentType.Code]: code,
    [ContentType.Styles]: styles,
    [ContentType.Data]: data,
  }[contentType];

  return dispatch(updateCurrentValue(contentType, valueToUse));
};

export const updateCurrentValueForContentType = (
  contentType: ContentType,
  newValue: string,
) => dispatch => {
  const validContent =
    contentType === ContentType.Data
      ? getValidContent(contentType, newValue)
      : newValue;
  return dispatch(updateCurrentValue(contentType, validContent));
};
