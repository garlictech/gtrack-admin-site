import { Action } from '@ngrx/store';
import { EPoiTypes } from 'subrepos/provider-client';
import {
  hikeEditPoiReducer, wikipediaPoiInitialState, googlePoiInitialState, osmAmenityPoiInitialState, osmNaturalPoiInitialState, osmRoutePoiInitialState, externalPoiInitialContextState, gTrackPoiInitialState
} from '../hike-edit-poi';
import { IHikeEditPoiState, hikeEditPoiActions } from '../..';
import { IExternalPoi } from 'app/shared/interfaces';

import * as _ from 'lodash';

describe('HikeEditPoi reducers', () => {
  let initialState: IHikeEditPoiState;
  let pois: IExternalPoi[];
  let ids: string[];
  let entities: any;

  beforeEach(() => {
    initialState = {
      wikipediaPois: wikipediaPoiInitialState,
      googlePois: googlePoiInitialState,
      osmAmenityPois: osmAmenityPoiInitialState,
      osmNaturalPois: osmNaturalPoiInitialState,
      osmRoutePois: osmRoutePoiInitialState,
      gTrackPois: gTrackPoiInitialState,
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

  describe('ResetPoiState action', () => {
    it('should reset state', () => {
      const action = new hikeEditPoiActions.ResetPoiState();
      const state = hikeEditPoiReducer(initialState, action);

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

      expect(state.googlePois.entities).toEqual(entities);
      // untouched props, good to add regardless
      expect(state.wikipediaPois.ids).toEqual([]);
      expect(state.osmAmenityPois.ids).toEqual([]);
      expect(state.osmNaturalPois.ids).toEqual([]);
      expect(state.osmRoutePois.ids).toEqual([]);
      expect(state.gTrackPois.ids).toEqual([]);
    });
  });

  describe('SetGooglePoiInHike action', () => {
    it('should set google poi inHike to true', () => {
      const action = new hikeEditPoiActions.SetGooglePoiInHike({
        poiId: '1',
        isInHike: true
      });
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        googlePois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.googlePois.entities['1'].inHike).toEqual(true);
    });

    it('should set google poi inHike to false', () => {
      const action = new hikeEditPoiActions.SetGooglePoiInHike({
        poiId: '1',
        isInHike: false
      });
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        googlePois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.googlePois.entities['1'].inHike).toEqual(false);
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
      expect(state.gTrackPois.ids).toEqual([]);
    });
  });

  describe('SetOsmAmenityPoiInHike action', () => {
    it('should set osmAmenity poi inHike to true', () => {
      const action = new hikeEditPoiActions.SetOsmAmenityPoiInHike({
        poiId: '1',
        isInHike: true
      });
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmAmenityPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmAmenityPois.entities['1'].inHike).toEqual(true);
    });

    it('should set osmAmenity poi inHike to false', () => {
      const action = new hikeEditPoiActions.SetOsmAmenityPoiInHike({
        poiId: '1',
        isInHike: false
      });
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmAmenityPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmAmenityPois.entities['1'].inHike).toEqual(false);
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
      expect(state.gTrackPois.ids).toEqual([]);
    });
  });

  describe('SetOsmNaturalPoiInHike action', () => {
    it('should set osmNatural poi inHike to true', () => {
      const action = new hikeEditPoiActions.SetOsmNaturalPoiInHike({
        poiId: '1',
        isInHike: true
      });
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmNaturalPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmNaturalPois.entities['1'].inHike).toEqual(true);
    });

    it('should set osmNatural poi inHike to false', () => {
      const action = new hikeEditPoiActions.SetOsmNaturalPoiInHike({
        poiId: '1',
        isInHike: false
      });
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmNaturalPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmNaturalPois.entities['1'].inHike).toEqual(false);
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
      expect(state.gTrackPois.ids).toEqual([]);
    });
  });

  describe('SetOsmRoutePoiInHike action', () => {
    it('should set osmRoute poi inHike to true', () => {
      const action = new hikeEditPoiActions.SetOsmRoutePoiInHike({
        poiId: '1',
        isInHike: true
      });
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmRoutePois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmRoutePois.entities['1'].inHike).toEqual(true);
    });

    it('should set osmRoute poi inHike to false', () => {
      const action = new hikeEditPoiActions.SetOsmRoutePoiInHike({
        poiId: '1',
        isInHike: false
      });
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmRoutePois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmRoutePois.entities['1'].inHike).toEqual(false);
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
      expect(state.gTrackPois.ids).toEqual([]);
    });
  });

  describe('SetWikipediaPoiInHike action', () => {
    it('should set wikipedia poi inHike to true', () => {
      const action = new hikeEditPoiActions.SetWikipediaPoiInHike({
        poiId: '1',
        isInHike: true
      });
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        wikipediaPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.wikipediaPois.entities['1'].inHike).toEqual(true);
    });

    it('should set wikipedia poi inHike to false', () => {
      const action = new hikeEditPoiActions.SetWikipediaPoiInHike({
        poiId: '1',
        isInHike: false
      });
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        wikipediaPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.wikipediaPois.entities['1'].inHike).toEqual(false);
    });
  });

  describe('GetGTrackPois action', () => {
    it('should get wikipedia pois', () => {
      const action = new hikeEditPoiActions.GetGTrackPois({
        centerCoord: [0, 0],
        radius: 1000,
        mapId: 'fakeMapId'
      });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.gTrackPois.ids).toEqual([]);
      expect(state.contexts.gTrack.loading).toEqual(true);
    });
  });

  describe('SetGTrackPois action', () => {
    it('should set gTrack pois', () => {
      const action = new hikeEditPoiActions.SetGTrackPois({ pois: pois });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.gTrackPois.entities).toEqual(entities);
      // untouched props, good to add regardless
      expect(state.googlePois.ids).toEqual([]);
      expect(state.osmAmenityPois.ids).toEqual([]);
      expect(state.osmNaturalPois.ids).toEqual([]);
      expect(state.osmRoutePois.ids).toEqual([]);
      expect(state.wikipediaPois.ids).toEqual([]);
    });
  });

  describe('SetGTrackPoiInHike action', () => {
    it('should set gTrack poi inHike to true', () => {
      const action = new hikeEditPoiActions.SetGTrackPoiInHike({
        poiId: '1',
        isInHike: true
      });
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        gTrackPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.gTrackPois.entities['1'].inHike).toEqual(true);
    });

    it('should set wikipedia poi inHike to false', () => {
      const action = new hikeEditPoiActions.SetWikipediaPoiInHike({
        poiId: '1',
        isInHike: false
      });
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        wikipediaPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.wikipediaPois.entities['1'].inHike).toEqual(false);
    });
  });

  describe('ToggleOnrouteMarkers action', () => {
    // showOnrouteMarkers is true initially

    it('should toggle google onroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOnrouteMarkers({ subdomain: 'google' });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.google.showOnrouteMarkers).toEqual(false);
    });

    it('should toggle osmAmenity onroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOnrouteMarkers({ subdomain: 'osmAmenity' });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.osmAmenity.showOnrouteMarkers).toEqual(false);
    });

    it('should toggle osmNatural onroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOnrouteMarkers({ subdomain: 'osmNatural' });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.osmNatural.showOnrouteMarkers).toEqual(false);
    });

    it('should toggle osmRoute onroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOnrouteMarkers({ subdomain: 'osmRoute' });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.osmRoute.showOnrouteMarkers).toEqual(false);
    });

    it('should toggle wikipedia onroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOnrouteMarkers({ subdomain: 'wikipedia' });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.wikipedia.showOnrouteMarkers).toEqual(false);
    });
  });

  describe('ToggleOffrouteMarkers action', () => {
    // showOffrouteMarkers is false initially

    it('should toggle google offroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOffrouteMarkers({ subdomain: 'google' });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.google.showOffrouteMarkers).toEqual(true);
    });

    it('should toggle osmAmenity offroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOffrouteMarkers({ subdomain: 'osmAmenity' });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.osmAmenity.showOffrouteMarkers).toEqual(true);
    });

    it('should toggle osmNatural offroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOffrouteMarkers({ subdomain: 'osmNatural' });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.osmNatural.showOffrouteMarkers).toEqual(true);
    });

    it('should toggle osmRoute offroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOffrouteMarkers({ subdomain: 'osmRoute' });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.osmRoute.showOffrouteMarkers).toEqual(true);
    });

    it('should toggle wikipedia offroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOffrouteMarkers({ subdomain: 'wikipedia' });
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.wikipedia.showOffrouteMarkers).toEqual(true);
    });
  });
});
