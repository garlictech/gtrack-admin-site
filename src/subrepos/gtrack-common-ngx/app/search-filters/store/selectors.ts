import { Inject, Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import * as _ from 'lodash';

import { ISearchFilters } from '../interfaces';
import { IExternalSearchFiltersDependencies, EXTERNAL_SEARCH_FILTERS_DEPENDENCIES } from '../externals';

@Injectable()
export class SearchFiltersSelectors {
  public getFilters: (state: object) => ISearchFilters;

  protected _externals: IExternalSearchFiltersDependencies;

  constructor(@Inject(EXTERNAL_SEARCH_FILTERS_DEPENDENCIES) externals) {
    this._externals = externals;
    const filterSelector = createFeatureSelector<ISearchFilters>(this._externals.storeDomain);

    this.getFilters = createSelector(filterSelector, (state: ISearchFilters) => state);
  }

  public getFilter(name: keyof ISearchFilters): MemoizedSelector<object, any> {
    return createSelector(this.getFilters, (filters: ISearchFilters) => _.get(filters, name));
  }
}
