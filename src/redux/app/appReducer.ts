import { handleActions } from 'redux-actions';
import { toggleSidebar } from './appActions';

export interface AppState {
  readonly sidebarExpanded: boolean;
}

export const initialState: AppState = {
  sidebarExpanded: false,
};

const appReducer = handleActions(
  {
    [toggleSidebar.toString()]: (state: AppState) => ({
      ...state,
      sidebarExpanded: !state.sidebarExpanded,
    }),
  },
  initialState,
);

export default appReducer;
