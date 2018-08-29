import { EObjectMarkContext } from 'subrepos/provider-client';

import {
  objectMarkReducerInitialState,
  objectMarkContextReducerInitialState,
  objectMarkReducer
} from '../reducer';

import { IObjectMarkState } from '../state';
import * as actions from '../actions';

describe('ObjectMarkReducer', () => {
  let initialState: IObjectMarkState;

  beforeEach(() => {
    initialState = {
      objectMarks: objectMarkReducerInitialState,
      contexts: objectMarkContextReducerInitialState
    };
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = objectMarkReducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('LOAD_CONTEXT action', () => {
    it('should set loading to true', () => {
      const action = new actions.LoadContext(EObjectMarkContext.bookmarkedHike);
      const state = objectMarkReducer(initialState, action);

      expect(state.contexts.entities[EObjectMarkContext.bookmarkedHike].loaded).toEqual(false);
      expect(state.contexts.entities[EObjectMarkContext.bookmarkedHike].loading).toEqual(true);
      expect(state.contexts.entities[EObjectMarkContext.bookmarkedHike].saved).toEqual(false);
      expect(state.contexts.entities[EObjectMarkContext.bookmarkedHike].saving).toEqual(false);
    });
  });

  describe('CONTEXT_LOADED action', () => {
    it('should add the loaded data to the store', () => {
      const loadAction = new actions.LoadContext(EObjectMarkContext.bookmarkedHike);
      let state = objectMarkReducer(initialState, loadAction);

      const action = new actions.ContextLoaded(EObjectMarkContext.bookmarkedHike, ['test']);
      state = objectMarkReducer(state, action);

      expect(state.contexts.entities[EObjectMarkContext.bookmarkedHike].loading).toEqual(false);
      expect(state.contexts.entities[EObjectMarkContext.bookmarkedHike].loaded).toEqual(true);

      expect(state.objectMarks.entities[EObjectMarkContext.bookmarkedHike].markedObjects).toEqual(['test']);
      expect(state.objectMarks.ids).toEqual([EObjectMarkContext.bookmarkedHike]);

      expect(state.contexts.entities[EObjectMarkContext.bookmarkedHike].saved).toEqual(false);
      expect(state.contexts.entities[EObjectMarkContext.bookmarkedHike].saving).toEqual(false);
    });
  });

  describe('MARK_OBJECT action', () => {
    it('should set saving to true', () => {
      const loadAction = new actions.LoadContext(EObjectMarkContext.bookmarkedHike);
      let state = objectMarkReducer(initialState, loadAction);

      const action = new actions.MarkObject(EObjectMarkContext.bookmarkedHike, ['test'], true);
      state = objectMarkReducer(state, action);

      expect(state.contexts.entities[EObjectMarkContext.bookmarkedHike].loading).toEqual(true);
      expect(state.contexts.entities[EObjectMarkContext.bookmarkedHike].loaded).toEqual(false);

      expect(state.contexts.entities[EObjectMarkContext.bookmarkedHike].saved).toEqual(false);
      expect(state.contexts.entities[EObjectMarkContext.bookmarkedHike].saving).toEqual(true);
    });
  });

  describe('OBJECT_MARKED action', () => {
    it('should set saved to true', () => {
      const loadAction = new actions.LoadContext(EObjectMarkContext.bookmarkedHike);
      let state = objectMarkReducer(initialState, loadAction);

      const saveAction = new actions.MarkObject(EObjectMarkContext.bookmarkedHike, ['test'], true);
      state = objectMarkReducer(state, saveAction);

      const action = new actions.ObjectMarked(EObjectMarkContext.bookmarkedHike, ['test'], true);
      state = objectMarkReducer(state, action);

      expect(state.contexts.entities[EObjectMarkContext.bookmarkedHike].saved).toEqual(true);
      expect(state.contexts.entities[EObjectMarkContext.bookmarkedHike].saving).toEqual(false);
    });
  });
});
