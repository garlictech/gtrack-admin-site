import { EPoiTypes } from '../../../../subrepos/provider-client';
import {
  hikeEditPoiReducer,
  wikipediaPoiInitialState,
  googlePoiInitialState,
  osmAmenityPoiInitialState,
  osmNaturalPoiInitialState,
  osmRoutePoiInitialState,
  externalPoiInitialContextState,
  initialGTrackPoiMergeState,
  poiCollectorInitialState
} from '../hike-edit-poi';
import { IHikeEditPoiState } from '../../index';
import { hikeEditPoiActions } from '../../actions';
import { IExternalPoi } from '../../../shared/interfaces';

import * as _ from 'lodash';

import { pois as poiFixtures, entities as entityFixtures } from './fixtures';

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
      collectorPois: poiCollectorInitialState,
      contexts: externalPoiInitialContextState,
      gTrackPoiMerge: initialGTrackPoiMergeState
    };

    pois = _.cloneDeep(poiFixtures);
    entities = _.cloneDeep(entityFixtures);
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

  describe('MergeSelection actions', () => {
    describe('ResetPoiMergeSelection action', () => {
      it('should reset merge selection', () => {
        const action = new hikeEditPoiActions.ResetPoiMergeSelection();
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.gTrackPoiMerge).toEqual(initialState.gTrackPoiMerge);
      });
    });

    describe('AddGTrackPoiToMergeSelection action', () => {
      it('should add gTrack poi to merge selection', () => {
        const action = new hikeEditPoiActions.AddGTrackPoiToMergeSelection(['1']);
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.gTrackPoiMerge.selections).toEqual(['1']);
      });
    });

    describe('RemoveGTrackPoiFromMergeSelection action', () => {
      it('should remove gTrack poi to merge selection', () => {
        const action = new hikeEditPoiActions.RemoveGTrackPoiFromMergeSelection(['1']);
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            gTrackPoiMerge: {
              selections: ['1', '2']
            }
          }),
          action
        );

        expect(state.gTrackPoiMerge.selections).toEqual(['2']);
      });
    });
  });

  describe('GooglePois actions', () => {
    describe('GetGooglePois action', () => {
      it('should get google pois', () => {
        const action = new hikeEditPoiActions.GetGooglePois(null, 'fakeMapId');
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.googlePois.ids).toEqual([]);
        expect(state.contexts.google.loading).toBeTruthy();
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

    describe('SetGooglePoisInGtrackDb action', () => {
      it('should set google pois inGtrackDb', () => {
        pois[0].inGtrackDb = true;

        const action = new hikeEditPoiActions.SetGooglePoisInGtrackDb(pois.map(p => _.pick(p, ['id', 'inGtrackDb'])));
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            googlePois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.googlePois.entities['1'].inGtrackDb).toBeTruthy();
        expect(state.googlePois.entities['2'].inGtrackDb).toBeFalsy();
      });
    });

    describe('SetGooglePoisInCollector action', () => {
      it('should set google pois inCollector', () => {
        pois[1].inCollector = true;

        const action = new hikeEditPoiActions.SetGooglePoisInCollector(pois.map(p => _.pick(p, ['id', 'inCollector'])));
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            googlePois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.googlePois.entities['1'].inCollector).toBeFalsy();
        expect(state.googlePois.entities['2'].inCollector).toBeTruthy();
      });
    });

    describe('SetGooglePoiSelected action', () => {
      it('should set google poi selected to true', () => {
        const action = new hikeEditPoiActions.SetGooglePoiSelected(['1']);
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            googlePois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.googlePois.entities['1'].selected).toBeTruthy();
      });

      it('should set google poi selected to false', () => {
        entities['1'].selected = true;
        entities['2'].selected = true;

        const action = new hikeEditPoiActions.SetGooglePoiSelected(['1']);
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            googlePois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.googlePois.entities['1'].selected).toBeFalsy();
      });
    });
  });

  describe('OsmAmenityPois actions', () => {
    describe('GetOsmAmenityPois action', () => {
      it('should get osmAmenity pois', () => {
        const action = new hikeEditPoiActions.GetOsmAmenityPois(null, 'fakeMapId');
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.osmAmenityPois.ids).toEqual([]);
        expect(state.contexts.osmAmenity.loading).toBeTruthy();
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

    describe('SetOsmAmenityPoisInGtrackDb action', () => {
      it('should set osmAmenity pois inGtrackDb', () => {
        pois[0].inGtrackDb = true;

        const action = new hikeEditPoiActions.SetOsmAmenityPoisInGtrackDb(
          pois.map(p => _.pick(p, ['id', 'inGtrackDb']))
        );
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            osmAmenityPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.osmAmenityPois.entities['1'].inGtrackDb).toBeTruthy();
        expect(state.osmAmenityPois.entities['2'].inGtrackDb).toBeFalsy();
      });
    });

    describe('SetOsmAmenityPoisInCollector action', () => {
      it('should set osmAmenity pois inCollector', () => {
        pois[1].inCollector = true;

        const action = new hikeEditPoiActions.SetOsmAmenityPoisInCollector(
          pois.map(p => _.pick(p, ['id', 'inCollector']))
        );
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            osmAmenityPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.osmAmenityPois.entities['1'].inCollector).toBeFalsy();
        expect(state.osmAmenityPois.entities['2'].inCollector).toBeTruthy();
      });
    });

    describe('SetOsmAmenityPoiSelected action', () => {
      it('should set osmAmenity poi selected to true', () => {
        const action = new hikeEditPoiActions.SetOsmAmenityPoiSelected(['1']);
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            osmAmenityPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.osmAmenityPois.entities['1'].selected).toBeTruthy();
      });

      it('should set osmAmenity poi selected to false', () => {
        entities['1'].selected = true;
        entities['2'].selected = true;

        const action = new hikeEditPoiActions.SetOsmAmenityPoiSelected(['1']);
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            osmAmenityPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.osmAmenityPois.entities['1'].selected).toBeFalsy();
      });
    });
  });

  describe('OsmNaturalPois actions', () => {
    describe('GetOsmNaturalPois action', () => {
      it('should get osmNatural pois', () => {
        const action = new hikeEditPoiActions.GetOsmNaturalPois(null, 'fakeMapId');
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.osmNaturalPois.ids).toEqual([]);
        expect(state.contexts.osmNatural.loading).toBeTruthy();
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

    describe('SetOsmNaturalPoisInGtrackDb action', () => {
      it('should set osmNatural pois inGtrackDb', () => {
        pois[0].inGtrackDb = true;

        const action = new hikeEditPoiActions.SetOsmNaturalPoisInGtrackDb(
          pois.map(p => _.pick(p, ['id', 'inGtrackDb']))
        );
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            osmNaturalPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.osmNaturalPois.entities['1'].inGtrackDb).toBeTruthy();
        expect(state.osmNaturalPois.entities['2'].inGtrackDb).toBeFalsy();
      });
    });

    describe('SetOsmNaturalPoisInCollector action', () => {
      it('should set osmNatural pois inCollector', () => {
        pois[1].inCollector = true;

        const action = new hikeEditPoiActions.SetOsmNaturalPoisInCollector(
          pois.map(p => _.pick(p, ['id', 'inCollector']))
        );
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            osmNaturalPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.osmNaturalPois.entities['1'].inCollector).toBeFalsy();
        expect(state.osmNaturalPois.entities['2'].inCollector).toBeTruthy();
      });
    });

    describe('SetOsmNaturalPoiSelected action', () => {
      it('should set osmNatural poi selected to true', () => {
        const action = new hikeEditPoiActions.SetOsmNaturalPoiSelected(['1']);
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            osmNaturalPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.osmNaturalPois.entities['1'].selected).toBeTruthy();
      });

      it('should set osmNatural poi selected to false', () => {
        entities['1'].selected = true;
        entities['2'].selected = true;

        const action = new hikeEditPoiActions.SetOsmNaturalPoiSelected(['1']);
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            osmNaturalPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.osmNaturalPois.entities['1'].selected).toBeFalsy();
      });
    });
  });

  describe('OsmRoutePois action', () => {
    describe('GetOsmRoutePois action', () => {
      it('should get osmRoute pois', () => {
        const action = new hikeEditPoiActions.GetOsmRoutePois(null, 'fakeMapId');
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.osmRoutePois.ids).toEqual([]);
        expect(state.contexts.osmRoute.loading).toBeTruthy();
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

    describe('SetOsmRoutePoisInGtrackDb action', () => {
      it('should set osmRoute pois inGtrackDb', () => {
        pois[0].inGtrackDb = true;

        const action = new hikeEditPoiActions.SetOsmRoutePoisInGtrackDb(pois.map(p => _.pick(p, ['id', 'inGtrackDb'])));
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            osmRoutePois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.osmRoutePois.entities['1'].inGtrackDb).toBeTruthy();
        expect(state.osmRoutePois.entities['2'].inGtrackDb).toBeFalsy();
      });
    });

    describe('SetOsmRoutePoisInCollector action', () => {
      it('should set osmRoute pois inCollector', () => {
        pois[1].inCollector = true;

        const action = new hikeEditPoiActions.SetOsmRoutePoisInCollector(
          pois.map(p => _.pick(p, ['id', 'inCollector']))
        );
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            osmRoutePois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.osmRoutePois.entities['1'].inCollector).toBeFalsy();
        expect(state.osmRoutePois.entities['2'].inCollector).toBeTruthy();
      });
    });

    describe('SetOsmRoutePoiSelected action', () => {
      it('should set osmRoute poi selected to true', () => {
        const action = new hikeEditPoiActions.SetOsmRoutePoiSelected(['1']);
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            osmRoutePois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.osmRoutePois.entities['1'].selected).toBeTruthy();
      });

      it('should set osmRoute poi selected to false', () => {
        entities['1'].selected = true;
        entities['2'].selected = true;

        const action = new hikeEditPoiActions.SetOsmRoutePoiSelected(['1']);
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            osmRoutePois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.osmRoutePois.entities['1'].selected).toBeFalsy();
      });
    });
  });

  describe('WikipediaPois actions', () => {
    describe('GetWikipediaPois action', () => {
      it('should get wikipedia pois', () => {
        const action = new hikeEditPoiActions.GetWikipediaPois(null, 'fakeMapId');
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.wikipediaPois.ids).toEqual([]);
        expect(state.contexts.wikipedia.loading).toBeTruthy();
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

    describe('SetWikipediaPoisInGtrackDb action', () => {
      it('should set wikipedia pois inGtrackDb', () => {
        pois[0].inGtrackDb = true;

        const action = new hikeEditPoiActions.SetWikipediaPoisInGtrackDb(
          pois.map(p => _.pick(p, ['id', 'inGtrackDb']))
        );
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            wikipediaPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.wikipediaPois.entities['1'].inGtrackDb).toBeTruthy();
        expect(state.wikipediaPois.entities['2'].inGtrackDb).toBeFalsy();
      });
    });

    describe('SetWikipediaPoisInCollector action', () => {
      it('should set wikipedia pois inCollector', () => {
        pois[1].inCollector = true;

        const action = new hikeEditPoiActions.SetWikipediaPoisInCollector(
          pois.map(p => _.pick(p, ['id', 'inCollector']))
        );
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            wikipediaPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.wikipediaPois.entities['1'].inCollector).toBeFalsy();
        expect(state.wikipediaPois.entities['2'].inCollector).toBeTruthy();
      });
    });

    describe('SetWikipediaPoiSelected action', () => {
      it('should set wikipedia poi selected to true', () => {
        const action = new hikeEditPoiActions.SetWikipediaPoiSelected(['1']);
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            wikipediaPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.wikipediaPois.entities['1'].selected).toBeTruthy();
      });

      it('should set wikipedia poi selected to false', () => {
        const action = new hikeEditPoiActions.SetWikipediaPoiSelected(['1']);
        entities['1'].selected = true;
        entities['2'].selected = true;
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            wikipediaPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.wikipediaPois.entities['1'].selected).toBeFalsy();
      });
    });
  });

  describe('Marker actions', () => {
    describe('ToggleOnrouteMarkers action', () => {
      // showOnrouteMarkers is true initially

      it('should toggle google onroute markers', () => {
        const action = new hikeEditPoiActions.ToggleOnrouteMarkers(EPoiTypes.google);
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.contexts.google.showOnrouteMarkers).toBeFalsy();
      });

      it('should toggle osmAmenity onroute markers', () => {
        const action = new hikeEditPoiActions.ToggleOnrouteMarkers(EPoiTypes.osmAmenity);
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.contexts.osmAmenity.showOnrouteMarkers).toBeFalsy();
      });

      it('should toggle osmNatural onroute markers', () => {
        const action = new hikeEditPoiActions.ToggleOnrouteMarkers(EPoiTypes.osmNatural);
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.contexts.osmNatural.showOnrouteMarkers).toBeFalsy();
      });

      it('should toggle osmRoute onroute markers', () => {
        const action = new hikeEditPoiActions.ToggleOnrouteMarkers(EPoiTypes.osmRoute);
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.contexts.osmRoute.showOnrouteMarkers).toBeFalsy();
      });

      it('should toggle wikipedia onroute markers', () => {
        const action = new hikeEditPoiActions.ToggleOnrouteMarkers(EPoiTypes.wikipedia);
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.contexts.wikipedia.showOnrouteMarkers).toBeFalsy();
      });
    });

    describe('ToggleOffrouteMarkers action', () => {
      // showOffrouteMarkers is false initially

      it('should toggle google offroute markers', () => {
        const action = new hikeEditPoiActions.ToggleOffrouteMarkers(EPoiTypes.google);
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.contexts.google.showOffrouteMarkers).toBeTruthy();
      });

      it('should toggle osmAmenity offroute markers', () => {
        const action = new hikeEditPoiActions.ToggleOffrouteMarkers(EPoiTypes.osmAmenity);
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.contexts.osmAmenity.showOffrouteMarkers).toBeTruthy();
      });

      it('should toggle osmNatural offroute markers', () => {
        const action = new hikeEditPoiActions.ToggleOffrouteMarkers(EPoiTypes.osmNatural);
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.contexts.osmNatural.showOffrouteMarkers).toBeTruthy();
      });

      it('should toggle osmRoute offroute markers', () => {
        const action = new hikeEditPoiActions.ToggleOffrouteMarkers(EPoiTypes.osmRoute);
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.contexts.osmRoute.showOffrouteMarkers).toBeTruthy();
      });

      it('should toggle wikipedia offroute markers', () => {
        const action = new hikeEditPoiActions.ToggleOffrouteMarkers(EPoiTypes.wikipedia);
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.contexts.wikipedia.showOffrouteMarkers).toBeTruthy();
      });
    });
  });

  describe('Context actions', () => {
    describe('SetSaving action', () => {
      it('should set saving pois', () => {
        const action = new hikeEditPoiActions.SetSaving(EPoiTypes.wikipedia, true);
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.contexts.wikipedia.saving).toBeTruthy();
      });
    });

    describe('SetLoading action', () => {
      it('should set loading pois', () => {
        const action = new hikeEditPoiActions.SetLoading(EPoiTypes.wikipedia);
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.contexts.wikipedia.loading).toBeTruthy();
        expect(state.contexts.wikipedia.loaded).toBeFalsy();
      });
    });

    describe('SetProcessing action', () => {
      it('should set processing pois', () => {
        const action = new hikeEditPoiActions.SetProcessing(EPoiTypes.wikipedia, true);
        const state = hikeEditPoiReducer(initialState, action);

        expect(state.contexts.wikipedia.processing).toBeTruthy();
      });
    });
  });

  describe('PoisToCollector actions', () => {
    describe('AddPoisToCollector action', () => {
      it('should add pois to collector', () => {
        const action = new hikeEditPoiActions.AddPoisToCollector(pois);
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            wikipediaPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.collectorPois.ids).toEqual(['1', '2']);
      });
    });

    describe('RemovePoisFromCollector action', () => {
      it('should remove pois to collector', () => {
        const action = new hikeEditPoiActions.RemovePoisFromCollector(['1']);
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            collectorPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.collectorPois.ids).toEqual(['2']);
      });
    });

    describe('SetCollectorPoiSelected action', () => {
      it('should set collector poi selected to true', () => {
        const action = new hikeEditPoiActions.SetCollectorPoiSelected(['1']);
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            collectorPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.collectorPois.entities['1'].selected).toBeTruthy();
      });

      it('should set collector poi selected to false', () => {
        const action = new hikeEditPoiActions.SetCollectorPoiSelected(['1']);
        entities['1'].selected = true;
        entities['2'].selected = true;
        const state = hikeEditPoiReducer(
          _.merge({}, initialState, {
            collectorPois: {
              ids: ['1', '2'],
              entities: entities
            }
          }),
          action
        );

        expect(state.collectorPois.entities['1'].selected).toBeFalsy();
      });
    });
  });
});
