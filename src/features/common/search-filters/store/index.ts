// tslint:disable:only-arrow-functions
import { InjectionToken } from '@angular/core';
import { ActionReducer, ActionReducerMap } from '@ngrx/store';
import { SearchFilters } from '../interfaces';
import * as SearchFilterActions from './actions';
import { searchFiltersReducer } from './reducer';

export { SearchFilterActions };
export * from './reducer';
export * from './selectors';
export * from './state';

export function getReducers(): ActionReducer<SearchFilters> {
  return searchFiltersReducer;
}

export const SEARCH_FILTERS_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<SearchFilters>>(
  'Registered SearchFilters Reducers'
);
