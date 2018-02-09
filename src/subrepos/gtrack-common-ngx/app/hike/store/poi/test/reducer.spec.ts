import { IPoi, IPoiStored, EPoiTypes } from 'subrepos/provider-client';
import * as uuid from 'uuid/v4';

import { poiReducer, poiReducerInitialState, poiContextReducerInitialState } from '../reducer';
import * as actions from '../actions';
import { IPoiState } from '../state';
import { Poi } from '../../../services/poi';

describe('PoiReducer', () => {
  let id: string;
  let initialState: IPoiState;
  let poiData: IPoi;
  let poiStored: IPoiStored;
  let poi: Poi;

  beforeEach(() => {
    id = uuid();
    initialState = {
      pois: poiReducerInitialState,
      contexts: poiContextReducerInitialState
    };
    poiData = {
      lat: 42.25,
      lon: 19.32,
      elevation: 0,
      objectType: EPoiTypes.google,
      types: [],
      description: {}
    };

    poiStored = {
      ...poiData,
      id,
      timestamp: new Date().getTime()
    };

    poi = new Poi(poiStored);
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = poiReducer(undefined, action);


      expect(state).toEqual(initialState);
    });
  });

  describe('LOAD_POI action', () => {
    it('should set loading to true', () => {
      const action = new actions.LoadPoi(id);
      const state = poiReducer(initialState, action);

      expect(state.pois.ids).toEqual([]);
      expect(state.contexts.ids).toEqual([id]);
      expect(state.contexts.entities[id].loaded).toEqual(false);
      expect(state.contexts.entities[id].loading).toEqual(true);
    });
  });

  describe('POI_LOADED action', () => {
    it('should set the poi', () => {
      const action = new actions.PoiLoaded(id, poi);
      const loadAction = new actions.LoadPoi(id);
      const beforeState = poiReducer(initialState, loadAction)
      const state = poiReducer(beforeState, action);

      expect(state.pois.ids).toEqual([id]);
      expect(state.contexts.ids).toEqual([id]);
      expect(state.contexts.entities[id].loaded).toEqual(true);
      expect(state.contexts.entities[id].loading).toEqual(false);
      expect(state.pois.entities[id]).toEqual(poi);
    });
  });
});