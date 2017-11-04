import { Action } from '@ngrx/store';
import { Actions } from './actions';
import { ILayoutState } from './state';

const initialLayoutState: ILayoutState = {
  showSidenav: false,
};

export function layoutReducer(state = initialLayoutState, action: Action): ILayoutState {
  switch (action.type) {
    case Actions.CLOSE_SIDENAV:
      return {
        showSidenav: false,
      };
    case Actions.OPEN_SIDENAV:
      return {
        showSidenav: true,
      };
    default:
      return state;
  }
}

export const getShowSidenav = (state: ILayoutState) => state.showSidenav;
