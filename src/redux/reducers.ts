import { combineReducers } from 'redux';
import app, { AppState } from './app/appReducer';
import content, { ContentState } from './content/contentReducer';

export default combineReducers({
  app,
  content,
});

export interface State {
  app: AppState;
  content: ContentState;
}

export type GetState = () => State;
