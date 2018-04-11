import * as actions from '../actions';
import { ISearchFilters } from '../../interfaces';

describe('SearchFilters actions', () => {
  describe('ChangeFilters action', () => {
    it('should create an action', () => {
      let filters: Partial<ISearchFilters> = {
        radius: 50,
        difficulty: [0, 5],
        time: [0, 5]
      };

      let action = new actions.ChangeFilters(filters);

      expect({...action}).toEqual({
        type: actions.SearchFilterActionTypes.CHANGE_FILTERS,
        filters: filters
      });
    });
  });
});
