import { Inject, Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import * as _ from 'lodash';

import { ISearchFilterState } from './state';
import { IExternalSearchFiltersDependencies, EXTERNAL_SEARCH_FILTERS_DEPENDENCIES } from '../externals';

@Injectable()
export class SearchFiltersSelectors {
  public getFilters: (state: object) => ISearchFilterState;

  protected _externals: IExternalSearchFiltersDependencies;

  constructor(
    @Inject(EXTERNAL_SEARCH_FILTERS_DEPENDENCIES) externals
  ) {
    this._externals = externals;
    let filterSelector = createFeatureSelector<ISearchFilterState>(this._externals.storeDomain);

    this.getFilters = createSelector(filterSelector, (state: ISearchFilterState) => state);
  }

  public getFilter(name: keyof ISearchFilterState): MemoizedSelector<object, any> {
    return createSelector(this.getFilters, (filters: ISearchFilterState) => _.get(filters, name));
  }
}
