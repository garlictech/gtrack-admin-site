import { Inject, Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity/src/models';
import * as _ from 'lodash';

import {
  geoSearchAdapter,
  geoSearchContextStateAdapter,
  IGeoSearchState,
  IGeoSearchContextState,
  IGeoSearchResponseItem
} from './state';

import {
  IExternalGeoSearchDependencies,
  EXTERNAL_GEO_SEARCH_DEPENDENCIES
} from '../externals';

interface GeoSearchableItem {
  id: string;
}

@Injectable()
export class GeoSearchSelectors {
  public selectFeature: MemoizedSelector<object, IGeoSearchState>;
  public getGeoSearchContexts: (state: object) => string[] | number[];
  public getAllGeoSearches: (state: object) => IGeoSearchResponseItem[];
  public getAllContexts: (state: object) => IGeoSearchContextState[];

  private _selectContextEntities: (state: object) => Dictionary<IGeoSearchContextState>;
  private _selectGeoSearchEntities: (state: object) => Dictionary<IGeoSearchResponseItem>;
  private _externals: IExternalGeoSearchDependencies;

  constructor(
    @Inject(EXTERNAL_GEO_SEARCH_DEPENDENCIES)
    externals
  ) {
    this._externals = externals;
    this.selectFeature = createFeatureSelector<IGeoSearchState>(this._externals.storeDomain);

    let geoSearchSelector = createSelector(this.selectFeature, (state: IGeoSearchState) => state.geoSearches);
    let contextSelector = createSelector(this.selectFeature, (state: IGeoSearchState) => state.contexts);

    const selectors = geoSearchAdapter.getSelectors(geoSearchSelector);
    const contextSelectors = geoSearchContextStateAdapter.getSelectors(contextSelector);

    this.getGeoSearchContexts = selectors.selectIds;
    this.getAllGeoSearches = selectors.selectAll;
    this.getAllContexts = contextSelectors.selectAll;
    this._selectGeoSearchEntities = selectors.selectEntities;
    this._selectContextEntities = contextSelectors.selectEntities;
  }

  public getGeoSearch(context: string) {
    return createSelector(this.getAllGeoSearches, (searches: IGeoSearchResponseItem[]) => (searches.find(search => (search.id === context))));
  }

  public getGeoSearchContext(context: string) {
    return createSelector(this.getAllContexts, (searches: IGeoSearchContextState[]) => (searches.find(search => (search.id === context))));
  }

  public getGeoSearchResults<T extends GeoSearchableItem>(context: string, getAllSelector: ((state: object) => T[])) {
    return createSelector(
      getAllSelector,
      this.getGeoSearch(context),
      (data, results) => {
        if (typeof results !== 'undefined') {
          let ids = results.results;

          return data.filter(item => ids.indexOf(item.id) !== -1);
        }
      }
    )
  }
}
