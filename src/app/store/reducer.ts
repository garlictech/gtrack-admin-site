import * as layout from './actions';

import { ILayoutState } from './state';

const initialLayoutState: ILayoutState = {
    showSidenav: false,
};

export function reducer(state = initialLayoutState, action: layout.LayoutActions): ILayoutState {
    switch (action.type) {
        case layout.CLOSE_SIDENAV:
            return {
                showSidenav: false,
            };
        case layout.OPEN_SIDENAV:
            return {
                showSidenav: true,
            };
        default:
            return state;
    }
}

export const getShowSidenav = (state: ILayoutState) => state.showSidenav;
