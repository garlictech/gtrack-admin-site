import { ISegment } from '../../../../subrepos/gtrack-common-ngx';
import { hikeEditRoutePlannerReducer, initialRouteInfoDataState } from '../hike-edit-route-planner';
import { hikeEditRoutePlannerActions } from '../../actions';
import { IHikeEditRoutePlannerState } from '../../index';

import _merge from 'lodash-es/merge';

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
      const action = new hikeEditRoutePlannerActions.AddRoute(routeData);
      const state = hikeEditRoutePlannerReducer(initialState, action);

      expect(state.route).toEqual(routeData);
    });
  });

  describe('PushSegment action', () => {
    it('should push segment', () => {
      const action = new hikeEditRoutePlannerActions.PushSegment(segmentData);
      const state = hikeEditRoutePlannerReducer(initialState, action);

      expect(state.segments).toEqual([segmentData]);
    });
  });

  describe('PopSegment action', () => {
    it('should push segment', () => {
      const action = new hikeEditRoutePlannerActions.PopSegment();
      const state = hikeEditRoutePlannerReducer(_merge({}, initialState, {
        segments: [segmentData, segmentData]
      }), action);

      expect(state.segments).toEqual([segmentData]);
    });
  });

  describe('UpdateTotal action', () => {
    it('should set total', () => {
      const total = { score: 100 };
      const action = new hikeEditRoutePlannerActions.UpdateTotal(total);
      const state = hikeEditRoutePlannerReducer(initialState, action);

      expect(state.total).toEqual(total);
    });
  });

  describe('UpdateTotal action', () => {
    it('should set total', () => {
      const action = new hikeEditRoutePlannerActions.SetPlanning(true);
      const state = hikeEditRoutePlannerReducer(initialState, action);

      expect(state.planning).toEqual(true);
    });
  });
});
