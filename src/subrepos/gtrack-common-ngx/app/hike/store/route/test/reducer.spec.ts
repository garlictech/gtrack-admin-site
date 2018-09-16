import * as uuid from 'uuid/v4';

import { routeReducer, routeReducerInitialState, routeContextReducerInitialState } from '../reducer';

import { IRoute, IRouteStored } from 'subrepos/provider-client';
import * as actions from '../actions';
import { IRouteState } from '../state';

describe('Route reducer', () => {
  let initialState: IRouteState;
  let id: string;
  let routeData: IRoute;
  let route: IRouteStored;

  beforeEach(() => {
    id = uuid();
    initialState = {
      routes: routeReducerInitialState,
      contexts: routeContextReducerInitialState
    };

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

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = routeReducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('LOAD_ROUTE action', () => {
    it('should set loading to true', () => {
      const action = new actions.LoadRoute(id);
      const state = routeReducer(initialState, action);

      expect(state.routes.ids).toEqual([]);
      expect(state.contexts.ids).toEqual([id]);
      expect(state.contexts.entities[id].loaded).toEqual(false);
      expect(state.contexts.entities[id].loading).toEqual(true);
    });
  });

  describe('ROUTE_LOADED action', () => {
    it('should set the route', () => {
      const action = new actions.RouteLoaded(id, route);
      const loadAction = new actions.LoadRoute(id);
      const beforeState = routeReducer(initialState, loadAction);
      const state = routeReducer(beforeState, action);

      expect(state.routes.ids).toEqual([id]);
      expect(state.contexts.ids).toEqual([id]);
      expect(state.contexts.entities[id].loaded).toEqual(true);
      expect(state.contexts.entities[id].loading).toEqual(false);
      expect(state.routes.entities[id]).toEqual(route);
    });
  });
});
