import { Action } from '@ngrx/store';
import { ISearchFilters } from '../interfaces';

export enum SearchFilterActionTypes {
  CHANGE_FILTERS = '[SearchFilters] Change filters',
  RESET_FILTERS = '[SearchFilters] Reset filters'
}

export class ChangeFilters implements Action {
  readonly type = SearchFilterActionTypes.CHANGE_FILTERS;

  constructor(public filters: Partial<ISearchFilters>) {}
}

export class ResetFilters implements Action {
  readonly type = SearchFilterActionTypes.RESET_FILTERS;
}

export type AllSearchFiltersAction = ChangeFilters | ResetFilters;
