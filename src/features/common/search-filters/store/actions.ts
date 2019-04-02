// tslint:disable:no-property-initializers max-classes-per-file
import { Action } from '@ngrx/store';
import { SearchFilters } from '../interfaces';

export enum SearchFilterActionTypes {
  CHANGE_FILTERS = '[SearchFilters] Change filters',
  RESET_FILTERS = '[SearchFilters] Reset filters'
}

export class ChangeFilters implements Action {
  readonly type = SearchFilterActionTypes.CHANGE_FILTERS;

  constructor(public filters: Partial<SearchFilters>) {}
}

export class ResetFilters implements Action {
  readonly type = SearchFilterActionTypes.RESET_FILTERS;
}

export type AllSearchFiltersAction = ChangeFilters | ResetFilters;
