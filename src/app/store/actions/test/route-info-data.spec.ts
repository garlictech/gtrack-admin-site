import { TestBed } from '@angular/core/testing';
import * as RouteInfoDataActions from '../route-info-data';

describe('RouteInfoData actions', () => {
  it('should have action names defined', () => {
    expect(RouteInfoDataActions.RESET).toEqual('[RouteInfoData] Reset');
    expect(RouteInfoDataActions.ADD_ROUTE).toEqual('[RouteInfoData] Add route');
    expect(RouteInfoDataActions.PUSH_SEGMENT).toEqual('[RouteInfoData] Push segment');
    expect(RouteInfoDataActions.POP_SEGMENT).toEqual('[RouteInfoData] Pop segment');
    expect(RouteInfoDataActions.UPDATE_TOTAL).toEqual('[RouteInfoData] Update total');
    expect(RouteInfoDataActions.SET_LOCATION).toEqual('[RouteInfoData] Set location');
  });

  it('should create Reset action', () => {
    const payload = { hikeId: 'fakeHikeId' };
    const action = new RouteInfoDataActions.Reset();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: RouteInfoDataActions.RESET
    });
  });

  it('should create Addroute action', () => {
    const payload = { route: 'fakeRouteData' };
    const action = new RouteInfoDataActions.AddRoute(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: RouteInfoDataActions.ADD_ROUTE,
      payload,
    });
  });

  it('should create PushSegment action', () => {
    const payload = { segment: 'fakeSegmentData' };
    const action = new RouteInfoDataActions.PushSegment(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: RouteInfoDataActions.PUSH_SEGMENT,
      payload,
    });
  });

  it('should create PopSegment action', () => {
    const action = new RouteInfoDataActions.PopSegment();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: RouteInfoDataActions.POP_SEGMENT
    });
  });

  it('should create UpdateTotal action', () => {
    const payload = { total: 'fakeValue' };
    const action = new RouteInfoDataActions.UpdateTotal(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: RouteInfoDataActions.UPDATE_TOTAL,
      payload,
    });
  });

  it('should create SetLocation action', () => {
    const payload = { location: 'fakeLocation' };
    const action = new RouteInfoDataActions.SetLocation(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: RouteInfoDataActions.SET_LOCATION,
      payload,
    });
  });
});
