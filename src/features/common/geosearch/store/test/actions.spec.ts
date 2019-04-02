import * as uuid from 'uuid/v1';

import {
  GeospatialBoxSearchPayload,
  GeospatialCircleSearchPayload
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import * as actions from '../actions';

describe('GeoSearch actions', () => {
  describe('SearchInBox action', () => {
    it('should create an action', () => {
      const context = uuid();

      const query: GeospatialBoxSearchPayload = {
        table: 'test',
        box: {
          type: 'Polygon',
          coordinates: [[[19.32, 47.14]]]
        }
      };

      const action = new actions.SearchInBox(query, context);
      expect(action.type).toEqual(actions.GeoSearchActionTypes.SEARCH_IN_BOX);
      expect(action.context).toEqual(context);
      expect(action.query).toEqual(query);
    });
  });

  describe('SearchInCircle action', () => {
    it('should create an action', () => {
      const context = uuid();

      const query: GeospatialCircleSearchPayload = {
        table: 'test',
        circle: {
          center: [19.41, 47.13],
          radius: 500
        }
      };

      const action = new actions.SearchInCircle(query, context);
      expect(action.type).toEqual(actions.GeoSearchActionTypes.SEARCH_IN_CIRCLE);
      expect(action.context).toEqual(context);
      expect(action.query).toEqual(query);
    });
  });

  describe('GeospatialSearchComplete action', () => {
    it('should create an action', () => {
      const ids = [uuid()];
      const context = uuid();
      const action = new actions.GeoSearchComplete(ids, context);

      expect(action.type).toEqual(actions.GeoSearchActionTypes.GEOSEARCH_COMPLETE);
      expect(action.results).toEqual(ids);
      expect(action.context).toEqual(context);
    });
  });
});
