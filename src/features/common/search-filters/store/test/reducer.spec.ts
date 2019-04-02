import { searchFiltersReducer, initialState } from '../reducer';
import * as actions from '../actions';
import { SearchFilters } from '../../interfaces';

describe('SearchFiltersReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = searchFiltersReducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('CHANGE_FILTERS action', () => {
    it('should change the filters', () => {
      const filters: Partial<SearchFilters> = {
        difficulty: [5, 6]
      };

      const action = new actions.ChangeFilters(filters);
      const state = searchFiltersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        difficulty: [5, 6]
      });
    });
  });

  describe('RESET_FILTERS action', () => {
    it('should reset the filters to the initial values', () => {
      const filters: Partial<SearchFilters> = {
        difficulty: [5, 6]
      };

      const action = new actions.ChangeFilters(filters);
      const state = searchFiltersReducer(initialState, action);

      const resetAction = new actions.ResetFilters();
      const resetState = searchFiltersReducer(state, resetAction);

      expect(resetState).toEqual(initialState);
    });
  });
});
