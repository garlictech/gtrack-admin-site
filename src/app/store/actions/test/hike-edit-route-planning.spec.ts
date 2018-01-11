import { TestBed } from '@angular/core/testing';
import * as HikeEditRoutePlanningActions from '../hike-edit-route-planning';

describe('HikeEditRoutePlanning actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditRoutePlanningActions.SAVE_ROUTE).toEqual('[HikeEditRoutePLanning] Save route');
  });

  it('should create SaveRoute action', () => {
    let expectedClass = new HikeEditRoutePlanningActions.SaveRoute();
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditRoutePlanningActions.SAVE_ROUTE);
  });
});
