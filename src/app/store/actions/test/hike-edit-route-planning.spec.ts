import { TestBed } from '@angular/core/testing';
import * as HikeEditRoutePlannerActions from '../hike-edit-route-planner';

describe('HikeEditRoutePlanner actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditRoutePlannerActions.RESET).toEqual('[HikeEditRoutePLanner] Reset');
    expect(HikeEditRoutePlannerActions.ADD_ROUTE).toEqual('[HikeEditRoutePLanner] Add route');
    expect(HikeEditRoutePlannerActions.PUSH_SEGMENT).toEqual('[HikeEditRoutePLanner] Push segment');
    expect(HikeEditRoutePlannerActions.POP_SEGMENT).toEqual('[HikeEditRoutePLanner] Pop segment');
    expect(HikeEditRoutePlannerActions.UPDATE_TOTAL).toEqual('[HikeEditRoutePLanner] Update total');
    expect(HikeEditRoutePlannerActions.SET_LOCATION).toEqual('[HikeEditRoutePLanner] Set location');
    expect(HikeEditRoutePlannerActions.SAVE_ROUTE).toEqual('[HikeEditRoutePLanner] Save route');
  });

  it('should create Reset action', () => {
    const payload = { hikeId: 'fakeHikeId' };
    const action = new HikeEditRoutePlannerActions.Reset();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.RESET
    });
  });

  it('should create Addroute action', () => {
    const payload = { route: 'fakeRouteData' };
    const action = new HikeEditRoutePlannerActions.AddRoute(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.ADD_ROUTE,
      payload,
    });
  });

  it('should create PushSegment action', () => {
    const payload = { segment: 'fakeSegmentData' };
    const action = new HikeEditRoutePlannerActions.PushSegment(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.PUSH_SEGMENT,
      payload,
    });
  });

  it('should create PopSegment action', () => {
    const action = new HikeEditRoutePlannerActions.PopSegment();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.POP_SEGMENT
    });
  });

  it('should create UpdateTotal action', () => {
    const payload = { total: 'fakeValue' };
    const action = new HikeEditRoutePlannerActions.UpdateTotal(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.UPDATE_TOTAL,
      payload,
    });
  });

  it('should create SetLocation action', () => {
    const payload = { location: 'fakeLocation' };
    const action = new HikeEditRoutePlannerActions.SetLocation(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.SET_LOCATION,
      payload,
    });
  });

  it('should create SaveRoute action', () => {
    const action = new HikeEditRoutePlannerActions.SaveRoute();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.SAVE_ROUTE
    });
  });
});
