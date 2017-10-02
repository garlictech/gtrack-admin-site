import * as GtActions from './actions';

import { ILayoutState } from './state';

const initialLayoutState: ILayoutState = {
  showSidenav: false,
};

export function reducer(state = initialLayoutState, action: GtActions.Actions): ILayoutState {
  switch (action.type) {
    case GtActions.CLOSE_SIDENAV:
      return {
        showSidenav: false,
      };
    case GtActions.OPEN_SIDENAV:
      return {
        showSidenav: true,
      };
    default:
      return state;
  }
}

export const getShowSidenav = (state: ILayoutState) => state.showSidenav;
