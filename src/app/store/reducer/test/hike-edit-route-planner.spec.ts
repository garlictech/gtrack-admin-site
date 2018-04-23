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

  describe('ResetRoutePlanningState action', () => {
    it('should reset state', () => {
      const action = new hikeEditRoutePlannerActions.ResetRoutePlanningState();
      const state = hikeEditRoutePlannerReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('AddRoute action', () => {
    it('should set route', () => {
      const routeData: any = {};
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
      const total = {
        distance: 100
      };
      const action = new hikeEditRoutePlannerActions.UpdateTotal({ total: total });
      const state = hikeEditRoutePlannerReducer(initialState, action);

      expect(state.total).toEqual(total);
    });
  });
});
