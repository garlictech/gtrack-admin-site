import {
  userStatusReducer,
  userStatusInitialState as initialState
} from '../reducer';

import { IUserStatusState } from '../state';
import * as actions from '../actions';

describe('UserStatusReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = userStatusReducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('LOCATION_REQUESTED', () => {
    it('should set the location', () => {
      const action = new actions.LocationRequested([0, 0]);
      const state  = userStatusReducer(initialState, action);

      expect(state.location).toEqual([0, 0]);
    });
  });
});
