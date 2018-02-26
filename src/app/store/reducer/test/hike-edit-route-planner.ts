import { Action } from '@ngrx/store';
import { ISegment } from 'subrepos/gtrack-common-ngx';
import { hikeEditRoutePlannerReducer, initialRouteInfoDataState } from '../hike-edit-route-planner';
import { hikeEditRoutePlannerActions, IHikeEditRoutePlannerState } from '../..';

import * as _ from 'lodash';

describe('RouteInfoData reducers', () => {
  let initialState: IHikeEditRoutePlannerState;
  let segmentData: ISegment;

  beforeEach(() => {
    initialState = initialRouteInfoDataState;
    segmentData = {
      distance: 0,
      uphill: 0,
      downhill: 0,
      coordinates: [[]]
    };
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = hikeEditRoutePlannerReducer(undefined, action);

      expect(state).toEqual(initialRouteInfoDataState);
    });
  });

  describe('Reset action', () => {
    it('should reset state', () => {
      const action = new hikeEditRoutePlannerActions.Reset();
      const state = hikeEditRoutePlannerReducer(initialState, action);

      expect(state.segments).toEqual([]);
      expect(state.total).toEqual({});
      expect(state.location).toEqual('');
      expect(state.route).toEqual({});
    });
  });

  describe('AddRoute action', () => {
    it('should set route', () => {
      const routeData = 'fakeRouteData';
      const action = new hikeEditRoutePlannerActions.AddRoute({ route: routeData });
      const state = hikeEditRoutePlannerReducer(initialState, action);

      expect(state.route).toEqual(routeData);
    });
  });

  describe('PushSegment action', () => {
    it('should push segment', () => {
      const action = new hikeEditRoutePlannerActions.PushSegment({ segment: segmentData });
      const state = hikeEditRoutePlannerReducer(initialState, action);

      expect(state.segments).toEqual([segmentData]);
    });
  });

  describe('PopSegment action', () => {
    it('should push segment', () => {
      const action = new hikeEditRoutePlannerActions.PopSegment();
      const state = hikeEditRoutePlannerReducer(_.merge({}, initialState, {
        segments: [segmentData, segmentData]
      }), action);

      expect(state.segments).toEqual([segmentData]);
    });
  });

  describe('UpdateTotal action', () => {
    it('should set total', () => {
      const total = 100;
      const action = new hikeEditRoutePlannerActions.UpdateTotal({ total: total });
      const state = hikeEditRoutePlannerReducer(initialState, action);

      expect(state.total).toEqual(total);
    });
  });
});
