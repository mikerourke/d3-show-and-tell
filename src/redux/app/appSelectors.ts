import { State } from '@redux/reducers';

export const selectIsSidebarExpanded = (state: State) =>
  state.app.sidebarExpanded;
