import { Action } from '@ngrx/store';
import { EPoiTypes } from 'subrepos/provider-client';
import {
  hikeEditPoiReducer, wikipediaPoiInitialState, googlePoiInitialState, osmAmenityPoiInitialState, osmNaturalPoiInitialState, osmRoutePoiInitialState, externalPoiInitialContextState
} from '../hike-edit-poi';
import { IHikeEditPoiState, hikeEditPoiActions } from '../..';
import { IExternalPoi } from 'app/shared/interfaces';

describe('HikeEditPoi reducers', () => {
  let initialState: IHikeEditPoiState;
  let pois: IExternalPoi[];
  let entities: any;

  beforeEach(() => {
    initialState = {
      wikipediaPois: wikipediaPoiInitialState,
      googlePois: googlePoiInitialState,
      osmAmenityPois: osmAmenityPoiInitialState,
      osmNaturalPois: osmNaturalPoiInitialState,
      osmRoutePois: osmRoutePoiInitialState,
      contexts: externalPoiInitialContextState
    };

    pois = [
      {
        id: '1',
        inHike: false,
        elevation: 0,
        lat: 0,
        lon: 0,
        objectType: EPoiTypes.google,
        types: [],
        description: {
          'en_US': {
            title: 'Title #1',
            summary: 'Summary #1',
            fullDescription: 'Description #1'
          }
        }
      },
      {
        id: '2',
        inHike: false,
        elevation: 0,
        lat: 0,
        lon: 0,
        objectType: EPoiTypes.google,
        types: [],
        description: {
          'en_US': {
            title: 'Title #2',
            summary: 'Summary #2',
            fullDescription: 'Description #2'
          }
        }
      }
    ];
    entities = {
      '1': pois[0],
      '2': pois[1]
    };
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = hikeEditPoiReducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('GetGooglePois action', () => {
    it('should get google pois', () => {
      const action = new hikeEditPoiActions.GetGooglePois({
        bounds: null,
        mapId: 'fakeMapId'
      });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.googlePois.ids).toEqual([]);
      expect(state.contexts.google.loading).toEqual(true);
    });
  });

  describe('SetGooglePois action', () => {
    it('should set google pois', () => {
      const action = new hikeEditPoiActions.SetGooglePois({ pois: pois });
      const state = hikeEditPoiReducer(initialState, action);
      console.log(state);
      expect(state.googlePois.entities).toEqual(entities);
      // untouched props, good to add regardless
      expect(state.wikipediaPois.ids).toEqual([]);
      expect(state.osmAmenityPois.ids).toEqual([]);
      expect(state.osmNaturalPois.ids).toEqual([]);
      expect(state.osmRoutePois.ids).toEqual([]);
    });
  });

  describe('GetOsmAmenityPois action', () => {
    it('should get osmAmenity pois', () => {
      const action = new hikeEditPoiActions.GetOsmAmenityPois({
        bounds: null,
        mapId: 'fakeMapId'
      });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.osmAmenityPois.ids).toEqual([]);
      expect(state.contexts.osmAmenity.loading).toEqual(true);
    });
  });

  describe('SetOsmAmenityPois action', () => {
    it('should set osmAmenity pois', () => {
      const action = new hikeEditPoiActions.SetOsmAmenityPois({ pois: pois });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.osmAmenityPois.entities).toEqual(entities);
      // untouched props, good to add regardless
      expect(state.googlePois.ids).toEqual([]);
      expect(state.wikipediaPois.ids).toEqual([]);
      expect(state.osmNaturalPois.ids).toEqual([]);
      expect(state.osmRoutePois.ids).toEqual([]);
    });
  });

  describe('GetOsmNaturalPois action', () => {
    it('should get osmNatural pois', () => {
      const action = new hikeEditPoiActions.GetOsmNaturalPois({
        bounds: null,
        mapId: 'fakeMapId'
      });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.osmNaturalPois.ids).toEqual([]);
      expect(state.contexts.osmNatural.loading).toEqual(true);
    });
  });

  describe('SetOsmNaturalPois action', () => {
    it('should set osmNatural pois', () => {
      const action = new hikeEditPoiActions.SetOsmNaturalPois({ pois: pois });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.osmNaturalPois.entities).toEqual(entities);
      // untouched props, good to add regardless
      expect(state.googlePois.ids).toEqual([]);
      expect(state.wikipediaPois.ids).toEqual([]);
      expect(state.osmAmenityPois.ids).toEqual([]);
      expect(state.osmRoutePois.ids).toEqual([]);
    });
  });

  describe('GetOsmRoutePois action', () => {
    it('should get osmRoute pois', () => {
      const action = new hikeEditPoiActions.GetOsmRoutePois({
        bounds: null,
        mapId: 'fakeMapId'
      });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.osmRoutePois.ids).toEqual([]);
      expect(state.contexts.osmRoute.loading).toEqual(true);
    });
  });

  describe('SetOsmRoutePois action', () => {
    it('should set osmRoute pois', () => {
      const action = new hikeEditPoiActions.SetOsmRoutePois({ pois: pois });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.osmRoutePois.entities).toEqual(entities);
      // untouched props, good to add regardless
      expect(state.googlePois.ids).toEqual([]);
      expect(state.wikipediaPois.ids).toEqual([]);
      expect(state.osmAmenityPois.ids).toEqual([]);
      expect(state.osmNaturalPois.ids).toEqual([]);
    });
  });

  describe('GetWikipediaPois action', () => {
    it('should get wikipedia pois', () => {
      const action = new hikeEditPoiActions.GetWikipediaPois({
        bounds: null,
        mapId: 'fakeMapId'
      });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.wikipediaPois.ids).toEqual([]);
      expect(state.contexts.wikipedia.loading).toEqual(true);
    });
  });

  describe('SetWikipediaPois action', () => {
    it('should set wikipedia pois', () => {
      const action = new hikeEditPoiActions.SetWikipediaPois({ pois: pois });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.wikipediaPois.entities).toEqual(entities);
      // untouched props, good to add regardless
      expect(state.googlePois.ids).toEqual([]);
      expect(state.osmAmenityPois.ids).toEqual([]);
      expect(state.osmNaturalPois.ids).toEqual([]);
      expect(state.osmRoutePois.ids).toEqual([]);
    });
  });
});
