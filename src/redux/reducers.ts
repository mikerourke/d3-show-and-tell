import { combineReducers } from 'redux';
import { Dispatch as FixedDispatch } from 'redux-fixed';
import content, { ContentState } from './content/contentReducer';

export default combineReducers({
  content,
});

export interface State {
  content: ContentState;
}

export type Dispatch<T> = FixedDispatch<T>;
export type GetState = () => State;

export interface BaseReduxAction {
  type: string;
}

export interface ReduxAction<Payload> extends BaseReduxAction {
  payload?: Payload;
  error?: boolean;
}
