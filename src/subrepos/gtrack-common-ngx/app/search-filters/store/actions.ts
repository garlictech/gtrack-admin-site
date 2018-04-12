import { Action } from '@ngrx/store';
import { ISearchFilters } from '../interfaces';

export enum SearchFilterActionTypes {
  CHANGE_FILTERS = '[SearchFilters] Change filters'
}

export class ChangeFilters implements Action {
  readonly type = SearchFilterActionTypes.CHANGE_FILTERS;

  constructor(public filters: Partial<ISearchFilters>) {}
}

export type AllSearchFiltersAction = ChangeFilters;
