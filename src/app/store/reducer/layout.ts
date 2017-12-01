import { ILayoutState } from '../state';
import { layoutActions } from '../index';

const initialState: ILayoutState = {
  showSidenav: false,
};

export function layoutReducer(
  state = initialState,
  action: layoutActions.AllLayoutActions
): ILayoutState {
  switch (action.type) {
    case layoutActions.CLOSE_SIDENAV:
      return {
        showSidenav: false,
      };
    case layoutActions.OPEN_SIDENAV:
      return {
        showSidenav: true,
      };
    default:
      return state;
  }
}

export const getShowSidenav = (state: ILayoutState) => state.showSidenav;
