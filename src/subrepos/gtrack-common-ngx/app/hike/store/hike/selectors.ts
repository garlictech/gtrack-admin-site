import { Inject, Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import _pickBy from 'lodash-es/pickBy';

import { hikeAdapter, hikeContextStateAdapter, IHikeState, IHikeContextState } from './state';
import { EXTERNAL_HIKE_DEPENDENCIES, IExternalHikeDependencies } from '../../externals';
import { Dictionary } from '@ngrx/entity/src/models';
import { IHikeProgramStored, EObjectState } from '../../../../../provider-client';

import { GeoSearchSelectors } from '../../../geosearch';
import { SearchFiltersSelectors } from '../../../search-filters';

@Injectable()
export class HikeSelectors {
  public selectFeature: MemoizedSelector<object, IHikeState>;
  public getHikeIds: (state: object) => string[] | number[];
  public getAllHikes: (state: object) => IHikeProgramStored[];
  public getAllContexts: (state: object) => IHikeContextState[];
  public getAllContextEntities: (state: object) => Dictionary<IHikeContextState>;

  protected _selectHikeEntities: (state: object) => Dictionary<IHikeProgramStored>;
  protected _externals: IExternalHikeDependencies;

  constructor(
    @Inject(EXTERNAL_HIKE_DEPENDENCIES) externals,
    private _geoSearchSelectors: GeoSearchSelectors,
    private _searchFiltersSelectors: SearchFiltersSelectors
  ) {
    this._externals = externals;
    this.selectFeature = createFeatureSelector<IHikeState>(this._externals.storeDomain);

    const hikeSelector = createSelector(this.selectFeature, (state: IHikeState) => state.hikes);
    const contextSelector = createSelector(this.selectFeature, (state: IHikeState) => state.contexts);

    const selectors = hikeAdapter.getSelectors(hikeSelector);
    const contextSelectors = hikeContextStateAdapter.getSelectors(contextSelector);

    this.getHikeIds = selectors.selectIds;
    this.getAllHikes = selectors.selectAll;
    this.getAllContexts = contextSelectors.selectAll;
    this._selectHikeEntities = selectors.selectEntities;
    this.getAllContextEntities = contextSelectors.selectEntities;
  }

  public getHike(context: string) {
    return createSelector(this.getAllHikes, (hikes: IHikeProgramStored[]) => hikes.find(hike => hike.id === context));
  }

  public getHikes(contexts: string[]) {
    return createSelector(this.getAllHikes, hikes => hikes.filter(hike => contexts.indexOf(hike.id) !== -1));
  }

  public getActiveHikes() {
    return createSelector(this.getAllHikes, (hikes: IHikeProgramStored[]) =>
      hikes.filter(hike => hike.state !== EObjectState.archived)
    );
  }

  public getHikeContext(id: string) {
    return createSelector(this.getAllContexts, contexts => {
      return contexts.find(context => context.id === id);
    });
  }

  public getHikeContexts(ids: string[]) {
    return createSelector(this.getAllContexts, contexts => contexts.filter(context => ids.indexOf(context.id) !== -1));
  }

  public getHikeContextEntities(ids: string[]) {
    return createSelector(this.getAllContextEntities, contexts =>
      _pickBy(contexts, context => {
        if (context.id) {
          return ids.indexOf(context.id) !== -1;
        } else {
          return false;
        }
      })
    );
  }

  public getFilteredSearchResults(context: string) {
    return createSelector(
      this._geoSearchSelectors.getGeoSearchResults<IHikeProgramStored>(context, this.getAllHikes),
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
          .filter(hike => {
            return hike.time >= filters.time[0] && hike.time <= filters.time[1];
          })
          .filter(hike => {
            return hike.distance >= filters.length[0] && hike.distance <= filters.length[1];
          });
      }
    );
  }
}
