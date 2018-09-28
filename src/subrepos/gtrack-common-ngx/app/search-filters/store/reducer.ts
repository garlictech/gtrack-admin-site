import { ActionReducer } from '@ngrx/store';
import { ISearchFilters } from '../interfaces';
import { AllSearchFiltersAction, SearchFilterActionTypes } from './actions';

export const initialState: ISearchFilters = {
  radius: 50000,
  difficulty: [0, 10],
  length: [0, 50000],
  time: [0, 3600],
  location: 'my-location',
  center: [19.040235, 47.497912]
};

export const searchFiltersReducer: ActionReducer<ISearchFilters> = (
  state: ISearchFilters = initialState,
  action: AllSearchFiltersAction
): ISearchFilters => {
  switch (action.type) {
    case SearchFilterActionTypes.CHANGE_FILTERS:
      return {
        ...state,
        ...action.filters
      };

    case SearchFilterActionTypes.RESET_FILTERS:
      return {
        ...initialState
      };

    default:
      return state;
  }
};
