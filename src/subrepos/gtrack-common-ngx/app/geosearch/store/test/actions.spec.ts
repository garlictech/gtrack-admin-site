import * as actions from '../actions';
import * as uuid from 'uuid/v1';
import { IGeospatialBoxSearchPayload, IGeospatialCircleSearchPayload } from 'subrepos/provider-client';

describe('GeoSearch actions', () => {

  describe('SearchInBox action', () => {
    it('should create an action', () => {
      let context = uuid();

      let query: IGeospatialBoxSearchPayload = {
        table: 'test',
        box: {
          type: 'Polygon',
          coordinates: [[
            [
              19.32,
              47.14
            ]
          ]]
        }
      };

      let action = new actions.SearchInBox(query, context);
      expect(action.type).toEqual(actions.GeoSearchActionTypes.SEARCH_IN_BOX);
      expect(action.context).toEqual(context);
      expect(action.query).toEqual(query);
    });
  });

  describe('SearchInCircle action', () => {
    it('should create an action', () => {
      let context = uuid();

      let query: IGeospatialCircleSearchPayload = {
        table: 'test',
        circle: {
          center: [19.41, 47.13],
          radius: 500
        }
      };

      let action = new actions.SearchInCircle(query, context);
      expect(action.type).toEqual(actions.GeoSearchActionTypes.SEARCH_IN_CIRCLE);
      expect(action.context).toEqual(context);
      expect(action.query).toEqual(query);
    });
  });

  describe('GeospatialSearchComplete action', () => {
    it('should create an action', () => {
      let ids = [uuid(), uuid()];
      let context = uuid();
      let action = new actions.GeoSearchComplete(ids, context);

      expect(action.type).toEqual(actions.GeoSearchActionTypes.GEOSEARCH_COMPLETE);
      expect(action.results).toEqual(ids);
      expect(action.context).toEqual(context);
    });
  });
});
