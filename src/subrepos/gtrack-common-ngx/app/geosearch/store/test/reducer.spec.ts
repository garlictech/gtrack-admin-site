import * as uuid from 'uuid/v1';

import { geoSearchReducer, geoSearchReducerInitialState, geoSearchContextReducerInitialState } from '../reducer';
import * as actions from '../actions';
import { GeoSearchState } from '../state';

describe('GeoSearchReducer', () => {
  let initialState: GeoSearchState;

  beforeEach(() => {
    initialState = {
      geoSearches: geoSearchReducerInitialState,
      contexts: geoSearchContextReducerInitialState
    };
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = geoSearchReducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('SEARCH_IN_BOX', () => {
    it('should set working to true', () => {
      const context = uuid();
      const action = new actions.SearchInBox(
        {
          table: 'test',
          box: {
            type: 'Polygon',
            coordinates: [[[14.4, 47.3]]]
          }
        },
        context
      );

      const state = geoSearchReducer(initialState, action);

      expect(state.contexts.entities[context].working).toEqual(true);
      expect(state.contexts.ids).toEqual([context]);
    });
  });

  describe('SEARCH_IN_CIRCLE', () => {
    it('should set working to true', () => {
      const context = uuid();
      const action = new actions.SearchInCircle(
        {
          table: 'test',
          circle: {
            center: [14.4, 47.3],
            radius: 500
          }
        },
        context
      );

      const state = geoSearchReducer(initialState, action);

      expect(state.contexts.entities[context].working).toEqual(true);
      expect(state.contexts.ids).toEqual([context]);
    });
  });

  describe('GEOSEARCH_COMPLETE', () => {
    it('should set working to false', () => {
      const context = uuid();
      const searchAction = new actions.SearchInCircle(
        {
          table: 'test',
          circle: {
            center: [14.4, 47.3],
            radius: 500
          }
        },
        context
      );

      const searchState = geoSearchReducer(initialState, searchAction);

      const action = new actions.GeoSearchComplete([], context);
      const state = geoSearchReducer(searchState, action);

      expect(state.contexts.entities[context].working).toEqual(false);
      expect(state.contexts.ids).toEqual([context]);
    });

    it('should add the results to the store', () => {
      const context = uuid();
      const results = [uuid(), uuid()];

      const searchAction = new actions.SearchInCircle(
        {
          table: 'test',
          circle: {
            center: [14.4, 47.3],
            radius: 500
          }
        },
        context
      );

      const searchState = geoSearchReducer(initialState, searchAction);

      const action = new actions.GeoSearchComplete(results, context);
      const state = geoSearchReducer(searchState, action);

      expect(state.geoSearches.entities[context]).toEqual({
        id: context,
        results: results
      });

      expect(state.geoSearches.ids).toEqual([context]);
    });
  });
});
