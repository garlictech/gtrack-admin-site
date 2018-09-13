import { EPoiTypes } from '../../../../subrepos/provider-client';
import {
  hikeEditPoiReducer, wikipediaPoiInitialState, googlePoiInitialState, osmAmenityPoiInitialState, osmNaturalPoiInitialState, osmRoutePoiInitialState, externalPoiInitialContextState, initialGTrackPoiMergeState, poiCollectorInitialState
} from '../hike-edit-poi';
import { IHikeEditPoiState } from '../..';
import { hikeEditPoiActions } from '../../actions';
import { IExternalPoi } from '../../../shared/interfaces';

import _pick from 'lodash-es/pick';

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
      collectorPois: poiCollectorInitialState,
      contexts: externalPoiInitialContextState,
      gTrackPoiMerge: initialGTrackPoiMergeState
    };

    pois = [
      {
        id: '1',
        selected: false,
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
        selected: false,
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
      const action = new hikeEditPoiActions.GetGooglePois(null, 'fakeMapId');
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.googlePois.ids).toEqual([]);
      expect(state.contexts.google.loading).toEqual(true);
    });
  });

  describe('SetGooglePois action', () => {
    it('should set google pois', () => {
      const action = new hikeEditPoiActions.SetGooglePois(pois);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.googlePois.entities).toEqual(entities);
      // untouched props, good to add regardless
      expect(state.wikipediaPois.ids).toEqual([]);
      expect(state.osmAmenityPois.ids).toEqual([]);
      expect(state.osmNaturalPois.ids).toEqual([]);
      expect(state.osmRoutePois.ids).toEqual([]);
    });
  });

  describe('PatchGooglePois action', () => {
    it('should patch google pois', () => {
      const action = new hikeEditPoiActions.SetGooglePoisInGtrackDb(
        pois.map(p => p.elevation = 100).map(p => _pick(p, ['id', 'elevation']))
      );
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        googlePois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.googlePois.entities['1'].elevation).toEqual(100);
      expect(state.googlePois.entities['2'].elevation).toEqual(100);
    });
  });

  describe('SetGooglePoiSelected action', () => {
    it('should set google poi selected to true', () => {
      const action = new hikeEditPoiActions.SetGooglePoiSelected(['1']);
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        googlePois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.googlePois.entities['1'].selected).toEqual(true);
    });

    it('should set google poi selected to false', () => {
      const action = new hikeEditPoiActions.SetGooglePoiSelected(['1']);
      entities['1'].selected = true;
      entities['2'].selected = true;
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        googlePois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.googlePois.entities['1'].selected).toEqual(false);
    });
  });

  describe('GetOsmAmenityPois action', () => {
    it('should get osmAmenity pois', () => {
      const action = new hikeEditPoiActions.GetOsmAmenityPois(null, 'fakeMapId');
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.osmAmenityPois.ids).toEqual([]);
      expect(state.contexts.osmAmenity.loading).toEqual(true);
    });
  });

  describe('SetOsmAmenityPois action', () => {
    it('should set osmAmenity pois', () => {
      const action = new hikeEditPoiActions.SetOsmAmenityPois(pois);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.osmAmenityPois.entities).toEqual(entities);
      // untouched props, good to add regardless
      expect(state.googlePois.ids).toEqual([]);
      expect(state.wikipediaPois.ids).toEqual([]);
      expect(state.osmNaturalPois.ids).toEqual([]);
      expect(state.osmRoutePois.ids).toEqual([]);
    });
  });

  describe('PatchOsmAmenityPois action', () => {
    it('should patch osmAmenity pois', () => {
      const action = new hikeEditPoiActions.SetOsmAmenityPoisInGtrackDb(
        pois.map(p => p.elevation = 100).map(p => _pick(p, ['id', 'elevation']))
      );
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmAmenityPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmAmenityPois.entities['1'].elevation).toEqual(100);
      expect(state.osmAmenityPois.entities['2'].elevation).toEqual(100);
    });
  });

  describe('SetOsmAmenityPoiSelected action', () => {
    it('should set osmAmenity poi selected to true', () => {
      const action = new hikeEditPoiActions.SetOsmAmenityPoiSelected(['1']);
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmAmenityPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmAmenityPois.entities['1'].selected).toEqual(true);
    });

    it('should set osmAmenity poi selected to false', () => {
      const action = new hikeEditPoiActions.SetOsmAmenityPoiSelected(['1']);
      entities['1'].selected = true;
      entities['2'].selected = true;
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmAmenityPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmAmenityPois.entities['1'].selected).toEqual(false);
    });
  });

  describe('GetOsmNaturalPois action', () => {
    it('should get osmNatural pois', () => {
      const action = new hikeEditPoiActions.GetOsmNaturalPois(null, 'fakeMapId');
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.osmNaturalPois.ids).toEqual([]);
      expect(state.contexts.osmNatural.loading).toEqual(true);
    });
  });

  describe('SetOsmNaturalPois action', () => {
    it('should set osmNatural pois', () => {
      const action = new hikeEditPoiActions.SetOsmNaturalPois(pois);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.osmNaturalPois.entities).toEqual(entities);
      // untouched props, good to add regardless
      expect(state.googlePois.ids).toEqual([]);
      expect(state.wikipediaPois.ids).toEqual([]);
      expect(state.osmAmenityPois.ids).toEqual([]);
      expect(state.osmRoutePois.ids).toEqual([]);
    });
  });

  describe('PatchOsmNaturalPois action', () => {
    it('should patch osmNatural pois', () => {
      const action = new hikeEditPoiActions.SetOsmNaturalPoisInGtrackDb(
        pois.map(p => p.elevation = 100).map(p => _pick(p, ['id', 'elevation']))
      );
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmNaturalPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmNaturalPois.entities['1'].elevation).toEqual(100);
      expect(state.osmNaturalPois.entities['2'].elevation).toEqual(100);
    });
  });

  describe('SetOsmNaturalPoiSelected action', () => {
    it('should set osmNatural poi selected to true', () => {
      const action = new hikeEditPoiActions.SetOsmNaturalPoiSelected(['1']);
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmNaturalPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmNaturalPois.entities['1'].selected).toEqual(true);
    });

    it('should set osmNatural poi selected to false', () => {
      const action = new hikeEditPoiActions.SetOsmNaturalPoiSelected(['1']);
      entities['1'].selected = true;
      entities['2'].selected = true;
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmNaturalPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmNaturalPois.entities['1'].selected).toEqual(false);
    });
  });

  describe('GetOsmRoutePois action', () => {
    it('should get osmRoute pois', () => {
      const action = new hikeEditPoiActions.GetOsmRoutePois(null, 'fakeMapId');
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.osmRoutePois.ids).toEqual([]);
      expect(state.contexts.osmRoute.loading).toEqual(true);
    });
  });

  describe('SetOsmRoutePois action', () => {
    it('should set osmRoute pois', () => {
      const action = new hikeEditPoiActions.SetOsmRoutePois(pois);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.osmRoutePois.entities).toEqual(entities);
      // untouched props, good to add regardless
      expect(state.googlePois.ids).toEqual([]);
      expect(state.wikipediaPois.ids).toEqual([]);
      expect(state.osmAmenityPois.ids).toEqual([]);
      expect(state.osmNaturalPois.ids).toEqual([]);
    });
  });

  describe('PatchOsmRoutePois action', () => {
    it('should patch osmNRoute pois', () => {
      const action = new hikeEditPoiActions.SetOsmRoutePoisInGtrackDb(
        pois.map(p => p.elevation = 100).map(p => _pick(p, ['id', 'elevation']))
      );
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmRoutePois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmRoutePois.entities['1'].elevation).toEqual(100);
      expect(state.osmRoutePois.entities['2'].elevation).toEqual(100);
    });
  });

  describe('SetOsmRoutePoiSelected action', () => {
    it('should set osmRoute poi selected to true', () => {
      const action = new hikeEditPoiActions.SetOsmRoutePoiSelected(['1'])
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmRoutePois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmRoutePois.entities['1'].selected).toEqual(true);
    });

    it('should set osmRoute poi selected to false', () => {
      const action = new hikeEditPoiActions.SetOsmRoutePoiSelected(['1']);
      entities['1'].selected = true;
      entities['2'].selected = true;
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        osmRoutePois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.osmRoutePois.entities['1'].selected).toEqual(false);
    });
  });

  describe('GetWikipediaPois action', () => {
    it('should get wikipedia pois', () => {
      const action = new hikeEditPoiActions.GetWikipediaPois(null, 'fakeMapId');
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.wikipediaPois.ids).toEqual([]);
      expect(state.contexts.wikipedia.loading).toEqual(true);
    });
  });

  describe('SetWikipediaPois action', () => {
    it('should set wikipedia pois', () => {
      const action = new hikeEditPoiActions.SetWikipediaPois(pois);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.wikipediaPois.entities).toEqual(entities);
      // untouched props, good to add regardless
      expect(state.googlePois.ids).toEqual([]);
      expect(state.osmAmenityPois.ids).toEqual([]);
      expect(state.osmNaturalPois.ids).toEqual([]);
      expect(state.osmRoutePois.ids).toEqual([]);
    });
  });

  describe('PatchWikipediaPois action', () => {
    it('should patch wikipedia pois', () => {
      const action = new hikeEditPoiActions.SetWikipediaPoisInGtrackDb(
        pois.map(p => p.elevation = 100).map(p => _pick(p, ['id', 'elevation']))
      );
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        wikipediaPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.wikipediaPois.entities['1'].elevation).toEqual(100);
      expect(state.wikipediaPois.entities['2'].elevation).toEqual(100);
    });
  });

  describe('SetWikipediaPoiSelected action', () => {
    it('should set wikipedia poi selected to true', () => {
      const action = new hikeEditPoiActions.SetWikipediaPoiSelected(['1']);
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        wikipediaPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.wikipediaPois.entities['1'].selected).toEqual(true);
    });

    it('should set wikipedia poi selected to false', () => {
      const action = new hikeEditPoiActions.SetWikipediaPoiSelected(['1']);
      entities['1'].selected = true;
      entities['2'].selected = true;
      const state = hikeEditPoiReducer(_.merge({}, initialState, {
        wikipediaPois: {
          ids: ['1', '2'],
          entities: entities
        }
      }), action);

      expect(state.wikipediaPois.entities['1'].selected).toEqual(false);
    });
  });

  describe('ToggleOnrouteMarkers action', () => {
    // showOnrouteMarkers is true initially

    it('should toggle google onroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOnrouteMarkers(EPoiTypes.google);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.google.showOnrouteMarkers).toEqual(false);
    });

    it('should toggle osmAmenity onroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOnrouteMarkers(EPoiTypes.osmAmenity);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.osmAmenity.showOnrouteMarkers).toEqual(false);
    });

    it('should toggle osmNatural onroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOnrouteMarkers(EPoiTypes.osmNatural);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.osmNatural.showOnrouteMarkers).toEqual(false);
    });

    it('should toggle osmRoute onroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOnrouteMarkers(EPoiTypes.osmRoute);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.osmRoute.showOnrouteMarkers).toEqual(false);
    });

    it('should toggle wikipedia onroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOnrouteMarkers(EPoiTypes.wikipedia);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.wikipedia.showOnrouteMarkers).toEqual(false);
    });
  });

  describe('ToggleOffrouteMarkers action', () => {
    // showOffrouteMarkers is false initially

    it('should toggle google offroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOffrouteMarkers(EPoiTypes.google);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.google.showOffrouteMarkers).toEqual(true);
    });

    it('should toggle osmAmenity offroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOffrouteMarkers(EPoiTypes.osmAmenity);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.osmAmenity.showOffrouteMarkers).toEqual(true);
    });

    it('should toggle osmNatural offroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOffrouteMarkers(EPoiTypes.osmNatural);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.osmNatural.showOffrouteMarkers).toEqual(true);
    });

    it('should toggle osmRoute offroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOffrouteMarkers(EPoiTypes.osmRoute);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.osmRoute.showOffrouteMarkers).toEqual(true);
    });

    it('should toggle wikipedia offroute markers', () => {
      const action = new hikeEditPoiActions.ToggleOffrouteMarkers(EPoiTypes.wikipedia);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.wikipedia.showOffrouteMarkers).toEqual(true);
    });
  });

  describe('SetSaving action', () => {
    it('should set saving pois', () => {
      const action = new hikeEditPoiActions.SetSaving(EPoiTypes.wikipedia, true);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.wikipedia.saving).toEqual(true);
    });
  });

  describe('SetLoading action', () => {
    it('should set loading pois', () => {
      const action = new hikeEditPoiActions.SetLoading(EPoiTypes.wikipedia);
      const state = hikeEditPoiReducer(initialState, action);

      expect(state.contexts.wikipedia.loading).toEqual(true);
      expect(state.contexts.wikipedia.loaded).toEqual(false);
    });
  });
});
