import { HikeProgramData, HikeProgramStored, EObjectState } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import * as uuid from 'uuid/v1';

import { hikeReducer, hikeReducerInitialState, hikeContextReducerInitialState } from '../reducer';
import * as actions from '../actions';
import { HikeState } from '../state';

describe('HikeProgramReducer', () => {
  let id: string;
  let initialState: HikeState;
  let hikeProgramData: HikeProgramData;
  let hikeProgram: HikeProgramStored;

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
      reverseTime: 19,
      score: 20,
      reverseScore: 30,
      feature: false,
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
      stops: [],
      reverseStops: []
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

  describe('HIKE_PROGRAM_REVERSED action', () => {
    it('should update the hikeProgram', () => {
      const action = new actions.HikeProgramReversed(id, {
        ...hikeProgram,
        reversed: true
      });

      const loadAction = new actions.HikeProgramLoaded(id, hikeProgram);
      const beforeState = hikeReducer(initialState, loadAction);
      const state = hikeReducer(beforeState, action);

      expect(state.hikes.ids).toEqual([id]);
      expect(state.contexts.ids).toEqual([id]);
      expect(state.contexts.entities[id].loaded).toEqual(true);
      expect(state.contexts.entities[id].loading).toEqual(false);
      expect(state.hikes.entities[id]).toEqual({
        ...hikeProgram,
        reversed: true
      });
    });
  });
});
