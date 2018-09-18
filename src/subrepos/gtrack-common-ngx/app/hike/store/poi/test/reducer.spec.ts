import { IPoi, IPoiStored, EObjectState } from 'subrepos/provider-client';

import { poiReducer, poiReducerInitialState, poiContextReducerInitialState } from '../reducer';
import * as actions from '../actions';
import { IPoiState } from '../state';

import { pois as poiFixtures } from './fixtures';

describe('PoiReducer', () => {
  let id: string;
  let initialState: IPoiState;
  let poiData: IPoi;
  let poiStored: IPoiStored;
  let poi: IPoiStored;

  beforeEach(() => {
    initialState = {
      pois: poiReducerInitialState,
      contexts: poiContextReducerInitialState
    };

    poiData = poiFixtures[0];
    id = poiData.id;

    poi = {
      ...poiData,
      id: id,
      timestamp: new Date().getTime(),
      state: EObjectState.draft
    };
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
      const beforeState = poiReducer(initialState, loadAction);
      const state = poiReducer(beforeState, action);

      expect(state.pois.ids).toEqual([id]);
      expect(state.contexts.ids).toEqual([id]);
      expect(state.contexts.entities[id].loaded).toEqual(true);
      expect(state.contexts.entities[id].loading).toEqual(false);
      expect(state.pois.entities[id]).toEqual(poi);
    });
  });
});
