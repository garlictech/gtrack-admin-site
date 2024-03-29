import _pickBy from 'lodash-es/pickBy';

import { Injectable } from '@angular/core';
import { GeoSearchSelectors } from '@bit/garlictech.angular-features.common.geosearch';
import { EObjectState, HikeProgramStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { SearchFiltersSelectors } from '@bit/garlictech.angular-features.common.search-filters';
import { Dictionary } from '@ngrx/entity/src/models';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { featureName, hikeAdapter, HikeContextState, hikeContextStateAdapter, HikeState } from './state';

@Injectable()
export class HikeSelectors {
  selectFeature: MemoizedSelector<object, HikeState>;
  getHikeIds: (state: object) => Array<string> | Array<number>;
  getAllHikes: (state: object) => Array<HikeProgramStored>;
  getAllContexts: (state: object) => Array<HikeContextState>;
  getAllContextEntities: (state: object) => Dictionary<HikeContextState>;

  protected _selectHikeEntities: (state: object) => Dictionary<HikeProgramStored>;

  constructor(
    private readonly _geoSearchSelectors: GeoSearchSelectors,
    private readonly _searchFiltersSelectors: SearchFiltersSelectors
  ) {
    this.selectFeature = createFeatureSelector<HikeState>(featureName);

    const hikeSelector = createSelector(
      this.selectFeature,
      (state: HikeState) => state.hikes
    );
    const contextSelector = createSelector(
      this.selectFeature,
      (state: HikeState) => state.contexts
    );

    const selectors = hikeAdapter.getSelectors(hikeSelector);
    const contextSelectors = hikeContextStateAdapter.getSelectors(contextSelector);

    this.getHikeIds = selectors.selectIds;
    this.getAllHikes = selectors.selectAll;
    this.getAllContexts = contextSelectors.selectAll;
    this._selectHikeEntities = selectors.selectEntities;
    this.getAllContextEntities = contextSelectors.selectEntities;
  }

  getHike(context: string): MemoizedSelector<object, HikeProgramStored> {
    return createSelector(
      this.getAllHikes,
      (hikes: Array<HikeProgramStored>) => hikes.find(hike => hike.id === context)
    );
  }

  getHikes(contexts: Array<string>): MemoizedSelector<object, Array<HikeProgramStored>> {
    return createSelector(
      this.getAllHikes,
      hikes => hikes.filter(hike => contexts.indexOf(hike.id) !== -1)
    );
  }

  getActiveHikes(): MemoizedSelector<object, Array<HikeProgramStored>> {
    return createSelector(
      this.getAllHikes,
      (hikes: Array<HikeProgramStored>) => hikes.filter(hike => hike.state !== EObjectState.archived)
    );
  }

  getHikeContext(id: string): MemoizedSelector<object, any> {
    return createSelector(
      this.getAllContexts,
      contexts => contexts.find(context => context.id === id)
    );
  }

  getHikeContexts(ids: Array<string>): MemoizedSelector<object, Array<any>> {
    return createSelector(
      this.getAllContexts,
      contexts => contexts.filter(context => ids.indexOf(context.id) !== -1)
    );
  }

  getHikeContextEntities(ids: Array<string>): MemoizedSelector<object, Dictionary<any>> {
    return createSelector(
      this.getAllContextEntities,
      contexts =>
        _pickBy(contexts, context => {
          if (context.id) {
            return ids.indexOf(context.id) !== -1;
          } else {
            return false;
          }
        })
    );
  }

  getSearchResults(context: string): MemoizedSelector<object, Array<HikeProgramStored>> {
    return this._geoSearchSelectors.getGeoSearchResults<HikeProgramStored>(context, this.getAllHikes);
  }

  getFilteredSearchResults(context: string): MemoizedSelector<object, Dictionary<any>> {
    return createSelector(
      this.getSearchResults(context),
      this._searchFiltersSelectors.getFilters,
      (hikes, filters) => {
        if (!(hikes instanceof Array)) {
          return hikes;
        }

        return hikes
          .filter(hike => {
            const difficulty = hike.difficulty || 0;

            return difficulty >= filters.difficulty[0] && difficulty <= filters.difficulty[1];
          })
          .filter(hike => hike.time >= filters.time[0] && hike.time <= filters.time[1])
          .filter(hike => hike.distance >= filters.length[0] && hike.distance <= filters.length[1]);
      }
    );
  }
}
