import { IRoute, IRouteStored, EObjectState } from 'subrepos/provider-client';
import * as uuid from 'uuid/v4';
import * as actions from '../actions';

describe('Route actions', () => {
  let id: string;
  let routeData: IRoute;
  let route: IRouteStored;

  beforeEach(() => {
    id = uuid();

    routeData = {
      bounds: {
        NorthEast: {
          lat: 47.498993,
          lon: 19.043699
        },
        SouthWest: {
          lat: 47.497157,
          lon: 19.049757
        }
      },
      route: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: 'Test'
            },
            geometry: {
              type: 'Point',
              coordinates: [18.95623999999998, 47.57855, 305.3887023925781]
            }
          }
        ]
      }
    };

    route = {
      ...routeData,
      id,
      timestamp: new Date().getTime()
    };
  });

  describe('Load route action', () => {
    it('should create an action', () => {
      const action = new actions.LoadRoute(id);

      expect({ ...action }).toEqual({
        type: actions.RouteActionTypes.LOAD_ROUTE,
        context: id
      });
    });
  });

  describe('RouteLoaded action', () => {
    it('should create an action', () => {
      const action = new actions.RouteLoaded(id, route);

      expect({ ...action }).toEqual({
        type: actions.RouteActionTypes.ROUTE_LOADED,
        route: route,
        context: id
      });
    });
  });

  describe('LoadRouteFailed action', () => {
    it('should create an action', () => {
      const action = new actions.LoadRouteFailed(id);

      expect({ ...action }).toEqual({
        type: actions.RouteActionTypes.LOAD_ROUTE_FAILED,
        context: id
      });
    });
  });

  describe('SaveRoute action', () => {
    it('should create an action', () => {
      const action = new actions.SaveRoute(route);

      expect({ ...action }).toEqual({
        type: actions.RouteActionTypes.SAVE_ROUTE,
        route: route
      });
    });
  });

  describe('RouteSaved action', () => {
    it('should create an action', () => {
      const action = new actions.RouteSaved(id);

      expect({ ...action }).toEqual({
        type: actions.RouteActionTypes.ROUTE_SAVED,
        context: id
      });
    });
  });

  describe('RouteModified action', () => {
    it('should create an action', () => {
      const action = new actions.RouteModified(id);

      expect({ ...action }).toEqual({
        type: actions.RouteActionTypes.ROUTE_MODIFIED,
        context: id
      });
    });
  });

  describe('UpdateRouteState action', () => {
    it('should create an action', () => {
      const action = new actions.UpdateRouteState(id, EObjectState.published);

      expect({ ...action }).toEqual({
        type: actions.RouteActionTypes.UPDATE_ROUTE_STATE,
        id: id,
        state: EObjectState.published
      });
    });
  });
});
