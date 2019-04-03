import _get from 'lodash-es/get';

import { Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { SearchFilters } from '../interfaces';
import { featureName } from './state';

@Injectable()
export class SearchFiltersSelectors {
  getFilters: (state: object) => SearchFilters;

  constructor() {
    const filterSelector = createFeatureSelector<SearchFilters>(featureName);

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
