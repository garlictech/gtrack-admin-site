import { Action } from '@ngrx/store';
import { LayoutActions } from '../actions';
import { ILayoutState } from '../state';

const initialState: ILayoutState = {
  showSidenav: false,
};

export function layoutReducer(state = initialState, action: Action): ILayoutState {
  switch (action.type) {
    case LayoutActions.CLOSE_SIDENAV:
      return {
        showSidenav: false,
      };
    case LayoutActions.OPEN_SIDENAV:
      return {
        showSidenav: true,
      };
    default:
      return state;
  }
}

export const getShowSidenav = (state: ILayoutState) => state.showSidenav;
