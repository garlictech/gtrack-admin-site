import { TestBed } from '@angular/core/testing';
import * as GtActions from '../actions';

describe('Actions', () => {
  it('should have action names defined', () => {
    expect(GtActions.OPEN_SIDENAV).toEqual('[Layout] Open Sidenav');
    expect(GtActions.CLOSE_SIDENAV).toEqual('[Layout] Close Sidenav');
    expect(GtActions.SAVE_HIKE).toEqual('[Hike] Save hike');
    expect(GtActions.DELETE_HIKE).toEqual('[Hike] Delete hike');
  });

  it('should create OpenSidenavAction action', () => {
    let expectedClass = new GtActions.OpenSidenavAction();
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(GtActions.OPEN_SIDENAV);
  });

  it('should create CloseSidenavAction action', () => {
    let expectedClass = new GtActions.CloseSidenavAction();
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(GtActions.CLOSE_SIDENAV);
  });

  it('should create SaveHikeAction action', () => {
    let expectedClass = new GtActions.SaveHikeAction({});
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(GtActions.SAVE_HIKE);
  });

  it('should create DeleteHikeAction action', () => {
    let expectedClass = new GtActions.DeleteHikeAction('id');
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(GtActions.DELETE_HIKE);
  });
});
