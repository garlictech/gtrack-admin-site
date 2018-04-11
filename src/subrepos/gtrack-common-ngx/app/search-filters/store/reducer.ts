import { ActionReducer } from '@ngrx/store';
import { ISearchFilterState } from './state';
import {
  AllSearchFiltersAction,
  SearchFilterActionTypes
} from './actions';

export const initialState: ISearchFilterState = {
  radius: 50000,
  difficulty: [0, 10],
  length: [0, 50000],
  time: [0, 600]
};

export const searchFiltersReducer: ActionReducer<ISearchFilterState> = (
  state: ISearchFilterState = initialState,
  action: AllSearchFiltersAction
): ISearchFilterState => {
  switch (action.type) {

    case SearchFilterActionTypes.CHANGE_FILTERS:
      return {
        ...state,
        ...action.filters
      };

    default:
      return state;
  }
};
