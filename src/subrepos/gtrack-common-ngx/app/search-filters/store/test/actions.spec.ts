import { SearchFilters } from '../../interfaces';
import * as actions from '../actions';

describe('SearchFilters actions', () => {
  describe('ChangeFilters action', () => {
    it('should create an action', () => {
      const _filters: Partial<SearchFilters> = {
        radius: 50,
        difficulty: [0, 5],
        time: [0, 5]
      };

      const action = new actions.ChangeFilters(_filters);

      expect({ ...action }).toEqual({
        type: actions.SearchFilterActionTypes.CHANGE_FILTERS,
        filters: _filters
      });
    });
  });

  describe('ResetFilters action', () => {
    it('should create an action', () => {
      const action = new actions.ResetFilters();

      expect({ ...action }).toEqual({
        type: actions.SearchFilterActionTypes.RESET_FILTERS
      });
    });
  });
});
