import { Inject, Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import * as _ from 'lodash';

import { hikeAdapter, hikeContextStateAdapter, IHikeState, IHikeContextState } from './state';
import { EXTERNAL_HIKE_DEPENDENCIES, IExternalHikeDependencies } from '../../externals';
import { Dictionary } from '@ngrx/entity/src/models';
import { IHikeProgram, IHikeProgramStored, EObjectState } from 'subrepos/provider-client';

import { GeoSearchSelectors } from '../../../geosearch';
import { SearchFiltersSelectors } from '../../../search-filters';

@Injectable()
export class HikeSelectors {
  public selectFeature: MemoizedSelector<object, IHikeState>;
  public getHikeIds: (state: object) => string[] | number[];
  public getAllHikes: (state: object) => IHikeProgramStored[];
  public getAllContexts: (state: object) => IHikeContextState[];

  protected _selectContextEntities: (state: object) => Dictionary<IHikeContextState>;
  protected _selectHikeEntities: (state: object) => Dictionary<IHikeProgramStored>;
  protected _externals: IExternalHikeDependencies;

  constructor(
    @Inject(EXTERNAL_HIKE_DEPENDENCIES) externals,
    private _geoSearchSelectors: GeoSearchSelectors,
    private _searchFiltersSelectors: SearchFiltersSelectors
  ) {
    this._externals = externals;
    this.selectFeature = createFeatureSelector<IHikeState>(this._externals.storeDomain);

    let hikeSelector = createSelector(this.selectFeature, (state: IHikeState) => state.hikes);
    let contextSelector = createSelector(this.selectFeature, (state: IHikeState) => state.contexts);

    const selectors = hikeAdapter.getSelectors(hikeSelector);
    const contextSelectors = hikeContextStateAdapter.getSelectors(contextSelector);

    this.getHikeIds = selectors.selectIds;
    this.getAllHikes = selectors.selectAll;
    this.getAllContexts = contextSelectors.selectAll;
    this._selectHikeEntities = selectors.selectEntities;
    this._selectContextEntities = contextSelectors.selectEntities;
  }

  public getHike(context: string) {
    return createSelector(this.getAllHikes, (hikes: IHikeProgramStored[]) => hikes.find(hike => hike.id === context));
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
            let difficulty = hike.difficulty || 0;

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
