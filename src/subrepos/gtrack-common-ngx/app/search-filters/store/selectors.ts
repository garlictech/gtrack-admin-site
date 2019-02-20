import { Inject, Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import _get from 'lodash-es/get';

import { EXTERNAL_SEARCH_FILTERS_DEPENDENCIES, ExternalSearchFiltersDependencies } from '../externals';
import { SearchFilters } from '../interfaces';

@Injectable()
export class SearchFiltersSelectors {
  getFilters: (state: object) => SearchFilters;

  protected _externals: ExternalSearchFiltersDependencies;

  constructor(@Inject(EXTERNAL_SEARCH_FILTERS_DEPENDENCIES) externals) {
    this._externals = externals;
    const filterSelector = createFeatureSelector<SearchFilters>(this._externals.storeDomain);

    this.getFilters = createSelector(
      filterSelector,
      (state: SearchFilters) => state
    );
  }

  getFilter(name: keyof SearchFilters): MemoizedSelector<object, any> {
    return createSelector(
      this.getFilters,
      (filters: SearchFilters) => _get(filters, name)
    );
  }
}
