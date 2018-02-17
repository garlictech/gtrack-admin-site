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
    let expectedClass = new RouteInfoDataActions.Reset();
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(RouteInfoDataActions.RESET);
  });

  it('should create Addroute action', () => {
    let expectedClass = new RouteInfoDataActions.AddRoute({
      route: null
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(RouteInfoDataActions.ADD_ROUTE);
  });

  it('should create PushSegment action', () => {
    let expectedClass = new RouteInfoDataActions.PushSegment({
      segment: null
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(RouteInfoDataActions.PUSH_SEGMENT);
  });

  it('should create PopSegment action', () => {
    let expectedClass = new RouteInfoDataActions.PopSegment();
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(RouteInfoDataActions.POP_SEGMENT);
  });

  it('should create UpdateTotal action', () => {
    let expectedClass = new RouteInfoDataActions.UpdateTotal({
      total: null
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(RouteInfoDataActions.UPDATE_TOTAL);
  });

  it('should create SetLocation action', () => {
    let expectedClass = new RouteInfoDataActions.SetLocation({
      location: null
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(RouteInfoDataActions.SET_LOCATION);
  });
});
