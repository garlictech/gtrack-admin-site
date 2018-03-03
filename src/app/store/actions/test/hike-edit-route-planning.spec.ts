import { TestBed } from '@angular/core/testing';
import * as HikeEditRoutePlannerActions from '../hike-edit-route-planner';

describe('HikeEditRoutePlanner actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditRoutePlannerActions.RESET).toEqual('[HikeEditRoutePlanner] Reset');
    expect(HikeEditRoutePlannerActions.ADD_ROUTE).toEqual('[HikeEditRoutePlanner] Add route');
    expect(HikeEditRoutePlannerActions.PUSH_SEGMENT).toEqual('[HikeEditRoutePlanner] Push segment');
    expect(HikeEditRoutePlannerActions.POP_SEGMENT).toEqual('[HikeEditRoutePlanner] Pop segment');
    expect(HikeEditRoutePlannerActions.UPDATE_TOTAL).toEqual('[HikeEditRoutePlanner] Update total');
    expect(HikeEditRoutePlannerActions.SET_LOCATION).toEqual('[HikeEditRoutePlanner] Set location');
    expect(HikeEditRoutePlannerActions.SAVE_ROUTE).toEqual('[HikeEditRoutePlanner] Save route');
  });

  it('should create Reset action', () => {
    const action = new HikeEditRoutePlannerActions.ResetRoutePlanningState();

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
