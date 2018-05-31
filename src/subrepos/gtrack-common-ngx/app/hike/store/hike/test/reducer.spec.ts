import { IHikeProgram, IHikeProgramStored, EObjectState } from 'subrepos/provider-client';
import * as uuid from 'uuid/v1';

import { hikeReducer, hikeReducerInitialState, hikeContextReducerInitialState } from '../reducer';
import * as actions from '../actions';
import { IHikeState } from '../state';
import { CheckpointService } from '../../../services/checkpoint';

describe('HikeProgramReducer', () => {
  let id: string;
  let initialState: IHikeState;
  let hikeProgramData: IHikeProgram;
  let hikeProgram: IHikeProgramStored;

  beforeEach(() => {
    id = uuid();
    initialState = {
      hikes: hikeReducerInitialState,
      contexts: hikeContextReducerInitialState
    };

    hikeProgramData = {
      id: id,
      distance: 5,
      isRoundTrip: false,
      uphill: 1,
      downhill: 1,
      time: 20,
      score: 20,
      location: 'Budapest',
      difficulty: 6,
      routeIcon: '',
      elevationIcon: '',
      routeId: uuid(),
      description: {
        en_US: {
          fullDescription: '',
          title: '',
          summary: ''
        }
      },
      stops: []
    };

    hikeProgram = {
      ...hikeProgramData,
      id: id,
      timestamp: new Date().getTime(),
      state: EObjectState.draft
    };
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = hikeReducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('LOAD_HIKE_PROGRAM action', () => {
    it('should set loading to true', () => {
      const action = new actions.LoadHikeProgram(id);
      const state = hikeReducer(initialState, action);

      expect(state.hikes.ids).toEqual([]);
      expect(state.contexts.ids).toEqual([id]);
      expect(state.contexts.entities[id].loaded).toEqual(false);
      expect(state.contexts.entities[id].loading).toEqual(true);
    });
  });

  describe('HIKE_PROGRAM_LOADED action', () => {
    it('should set the hikeProgram', () => {
      const action = new actions.HikeProgramLoaded(id, hikeProgram);
      const loadAction = new actions.LoadHikeProgram(id);
      const beforeState = hikeReducer(initialState, loadAction);
      const state = hikeReducer(beforeState, action);

      expect(state.hikes.ids).toEqual([id]);
      expect(state.contexts.ids).toEqual([id]);
      expect(state.contexts.entities[id].loaded).toEqual(true);
      expect(state.contexts.entities[id].loading).toEqual(false);
      expect(state.hikes.entities[id]).toEqual(hikeProgram);
    });
  });
});
