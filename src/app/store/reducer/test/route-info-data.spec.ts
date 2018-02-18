import { Action } from '@ngrx/store';
import { ISegment } from 'subrepos/gtrack-common-ngx';
import { routeInfoDataReducer, initialRouteInfoDataState } from '../route-info-data';
import { routeInfoDataActions, IRouteInfoDataState } from '../..';

import * as _ from 'lodash';

describe('RouteInfoData reducers', () => {
  let initialState: IRouteInfoDataState;
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
      const state = routeInfoDataReducer(undefined, action);

      expect(state).toEqual(initialRouteInfoDataState);
    });
  });

  describe('Reset action', () => {
    it('should reset state', () => {
      const action = new routeInfoDataActions.Reset();
      const state = routeInfoDataReducer(initialState, action);

      expect(state.segments).toEqual([]);
      expect(state.total).toEqual({});
      expect(state.location).toEqual('');
      expect(state.route).toEqual({});
    });
  });

  describe('AddRoute action', () => {
    it('should set route', () => {
      const routeData = 'fakeRouteData';
      const action = new routeInfoDataActions.AddRoute({ route: routeData });
      const state = routeInfoDataReducer(initialState, action);

      expect(state.route).toEqual(routeData);
    });
  });

  describe('PushSegment action', () => {
    it('should push segment', () => {
      const action = new routeInfoDataActions.PushSegment({ segment: segmentData });
      const state = routeInfoDataReducer(initialState, action);

      expect(state.segments).toEqual([segmentData]);
    });
  });

  describe('PopSegment action', () => {
    it('should push segment', () => {
      const action = new routeInfoDataActions.PopSegment();
      const state = routeInfoDataReducer(_.merge({}, initialState, {
        segments: [segmentData, segmentData]
      }), action);

      expect(state.segments).toEqual([segmentData]);
    });
  });

  describe('UpdateTotal action', () => {
    it('should set total', () => {
      const total = 100;
      const action = new routeInfoDataActions.UpdateTotal({ total: total });
      const state = routeInfoDataReducer(initialState, action);

      expect(state.total).toEqual(total);
    });
  });
});
