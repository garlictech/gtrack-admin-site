import { Inject, Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { EXTERNAL_GEO_SEARCH_DEPENDENCIES, ExternalGeoSearchDependencies } from '../externals';
import {
  geoSearchAdapter,
  GeoSearchContextState,
  geoSearchContextStateAdapter,
  GeoSearchResponseItem,
  GeoSearchState
} from './state';

interface GeoSearchableItem {
  id: string;
}

@Injectable()
export class GeoSearchSelectors {
  selectFeature: MemoizedSelector<object, GeoSearchState>;
  getGeoSearchContexts: (state: object) => Array<string> | Array<number>;
  getAllGeoSearches: (state: object) => Array<GeoSearchResponseItem>;
  getAllContexts: (state: object) => Array<GeoSearchContextState>;
  private readonly _externals: ExternalGeoSearchDependencies;

  constructor(@Inject(EXTERNAL_GEO_SEARCH_DEPENDENCIES) externals) {
    this._externals = externals;
    this.selectFeature = createFeatureSelector<GeoSearchState>(this._externals.storeDomain);

    const geoSearchSelector = createSelector(
      this.selectFeature,
      (state: GeoSearchState) => state.geoSearches
    );
    const contextSelector = createSelector(
      this.selectFeature,
      (state: GeoSearchState) => state.contexts
    );

    const selectors = geoSearchAdapter.getSelectors(geoSearchSelector);
    const contextSelectors = geoSearchContextStateAdapter.getSelectors(contextSelector);

    this.getGeoSearchContexts = selectors.selectIds;
    this.getAllGeoSearches = selectors.selectAll;
    this.getAllContexts = contextSelectors.selectAll;
  }

  getGeoSearch(context: string): MemoizedSelector<object, GeoSearchResponseItem> {
    return createSelector(
      this.getAllGeoSearches,
      (searches: Array<GeoSearchResponseItem>) => searches.find(search => search.id === context)
    );
  }

  getGeoSearchContext(context: string): MemoizedSelector<object, GeoSearchContextState> {
    return createSelector(
      this.getAllContexts,
      (searches: Array<GeoSearchContextState>) => searches.find(search => search.id === context)
    );
  }

  getGeoSearchResults<T extends GeoSearchableItem>(
    context: string,
    getAllSelector: (state: object) => Array<T>
  ): MemoizedSelector<object, Array<T>> {
    return createSelector(
      getAllSelector,
      this.getGeoSearch(context),
      (data, results) => {
        if (typeof results !== 'undefined') {
          const ids = results.results;

          return data.filter(item => ids.indexOf(item.id) !== -1);
        }
      }
    );
  }
}
