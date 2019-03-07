import * as _ from 'lodash';

import { ISegment } from '../../../../subrepos/gtrack-common-ngx';
import { hikeEditRoutePlannerActions } from '../../actions';
import { HikeEditRoutePlannerState } from '../../index';
import { hikeEditRoutePlannerReducer, initialRouteInfoDataState } from '../hike-edit-route-planner';

fdescribe('RoutePlanner reducers', () => {
  let initialState: HikeEditRoutePlannerState;
  let segmentData: ISegment;
  let segmentData2: ISegment;

  beforeEach(() => {
    initialState = initialRouteInfoDataState;
    segmentData = {
      distance: 0,
      uphill: 0,
      downhill: 0,
      coordinates: [[]]
    };
    segmentData2 = {
      distance: 2,
      uphill: 2,
      downhill: 2,
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

  describe('RoutingStart action', () => {
    it('should start routing', () => {
      const action = new hikeEditRoutePlannerActions.RoutingStart();
      const state = hikeEditRoutePlannerReducer(initialState, action);

      expect(state.routing).toEqual(true);
    });
  });

  describe('RoutingFinished action', () => {
    it('should finish routing', () => {
      const action = new hikeEditRoutePlannerActions.RoutingFinished();
      const state = hikeEditRoutePlannerReducer(initialState, action);

      expect(state.routing).toEqual(false);
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

  describe('UpdateSegment action', () => {
    it('should update segment', () => {
      const action = new hikeEditRoutePlannerActions.UpdateSegment(0, segmentData2);
      const state = hikeEditRoutePlannerReducer(
        _.merge({}, initialState, {
          segments: [segmentData, segmentData2]
        }),
        action
      );

      expect(state.segments).toEqual([segmentData2, segmentData2]);
    });
  });

  describe('UpdateSegment action', () => {
    it('should update segment', () => {
      const action = new hikeEditRoutePlannerActions.RemoveSegments(0, 1);
      const state = hikeEditRoutePlannerReducer(
        _.merge({}, initialState, {
          segments: [segmentData, segmentData2]
        }),
        action
      );

      expect(state.segments).toEqual([segmentData2]);
    });
  });

  describe('PopSegment action', () => {
    it('should pop segment', () => {
      const action = new hikeEditRoutePlannerActions.PopSegment();
      const state = hikeEditRoutePlannerReducer(
        _.merge({}, initialState, {
          segments: [segmentData, segmentData]
        }),
        action
      );

      expect(state.segments).toEqual([segmentData]);
    });

    it('should pop segment from a single segment array', () => {
      const action = new hikeEditRoutePlannerActions.PopSegment();
      const state = hikeEditRoutePlannerReducer(
        _.merge({}, initialState, {
          segments: [segmentData]
        }),
        action
      );

      expect(state.segments).toEqual([]);
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
