// tslint:disable:no-duplicate-string
import { EObjectMarkContext } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import * as actions from '../actions';

describe('ObjectMark actions', () => {
  describe('LoadContext action', () => {
    it('should create an action', () => {
      const action = new actions.LoadContext(EObjectMarkContext.bookmarkedHike);

      expect({ ...action }).toEqual({
        type: actions.ObjectMarkActionTypes.LOAD_CONTEXT,
        context: EObjectMarkContext.bookmarkedHike
      });
    });
  });

  describe('ContextLoaded action', () => {
    it('should create an action', () => {
      const action = new actions.ContextLoaded(EObjectMarkContext.bookmarkedHike, ['test']);

      expect({ ...action }).toEqual({
        type: actions.ObjectMarkActionTypes.CONTEXT_LOADED,
        context: EObjectMarkContext.bookmarkedHike,
        objects: ['test']
      });
    });
  });

  describe('MarkObject action', () => {
    it('should create an action', () => {
      const action = new actions.MarkObject(EObjectMarkContext.bookmarkedHike, 'test', true);

      expect({ ...action }).toEqual({
        type: actions.ObjectMarkActionTypes.MARK_OBJECT,
        context: EObjectMarkContext.bookmarkedHike,
        object: 'test',
        mark: true
      });
    });
  });

  describe('ObjectMarked action', () => {
    it('should create an action', () => {
      const action = new actions.ObjectMarked(EObjectMarkContext.bookmarkedHike, 'test', true);

      expect({ ...action }).toEqual({
        type: actions.ObjectMarkActionTypes.OBJECT_MARKED,
        context: EObjectMarkContext.bookmarkedHike,
        object: 'test',
        mark: true
      });
    });
  });
});
