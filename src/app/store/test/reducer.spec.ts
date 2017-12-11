import { Action } from '@ngrx/store';
import * as GtActions from '../actions';
// import { reducer, getShowSidenav } from '../reducer';
import { ILayoutState } from '../state';

/*
describe('Reducers', () => {
  it('should handle initial state', () => {
    expect(
      reducer({showSidenav: false}, {type: null})
    )
    .toEqual({showSidenav: false});
  });

  it('should handle close sidenav', () => {
    expect(
      reducer({showSidenav: true}, {type: GtActions.CLOSE_SIDENAV})
    )
    .toEqual({showSidenav: false});
  });

  it('should handle open sidenav', () => {
    expect(
      reducer({showSidenav: false}, {type: GtActions.OPEN_SIDENAV})
    )
    .toEqual({showSidenav: true});
  });

  it('should get sidenav state', () => {
    let openedSidenavState = getShowSidenav({showSidenav: true});
    expect(openedSidenavState).toBeTruthy();

    let closedSidenavState = getShowSidenav({showSidenav: false});
    expect(closedSidenavState).toBeFalsy();
  });
});
*/
