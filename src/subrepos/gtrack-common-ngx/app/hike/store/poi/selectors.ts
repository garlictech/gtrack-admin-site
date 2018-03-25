import { Inject, Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { poiAdapter, IPoiState, IPoiContextState } from './state';
import { EXTERNAL_POI_DEPENDENCIES, IExternalPoiDependencies } from '../../externals';
import { poiContextStateAdapter } from 'subrepos/gtrack-common-ngx/app/hike/store/poi';
import { IPoi } from 'subrepos/provider-client';
import { Dictionary } from '@ngrx/entity/src/models';

import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PoiSelectors {
  public selectFeature: MemoizedSelector<object, IPoiState>;
  public getPoiIds: (state: object) => string[] | number[];
  public getAllPois: (state: object) => IPoi[];
  public getAllPoiEntities: (state: object) => Dictionary<IPoi>;
  public getAllContexts: (state: object) => IPoiContextState[];
  public getAllContextEntities: (state: object) => Dictionary<IPoiContextState>;

  private _externals: IExternalPoiDependencies;

  constructor(@Inject(EXTERNAL_POI_DEPENDENCIES) externals) {
    this._externals = externals;

    this.selectFeature = createFeatureSelector<IPoiState>(this._externals.storeDomain);

    let poiSelector = createSelector(this.selectFeature, (state: IPoiState) => state.pois);
    let contextSelector = createSelector(this.selectFeature, (state: IPoiState) => state.contexts);

    const selectors = poiAdapter.getSelectors(poiSelector);
    const contextSelectors = poiContextStateAdapter.getSelectors(contextSelector);

    this.getPoiIds = selectors.selectIds;
    this.getAllPois = selectors.selectAll;
    this.getAllPoiEntities = selectors.selectEntities;
    this.getAllContexts = contextSelectors.selectAll;
    this.getAllContextEntities = contextSelectors.selectEntities;
  }

  public getPoi(context: string) {
    return createSelector(this.getAllPois, (pois: IPoi[]) => pois.find(poi => (poi.id === context)));
  }

  public getPoiContext(context: string) {
    return createSelector(this.getAllContexts, (contexts: IPoiContextState[]) => {
      return contexts.find(c => (c.id === context))
    });
  }

  public getPois(contexts: string[]) {
    return createSelector(
      this.getAllPois,
      pois => pois.filter(poi => {
        if (poi.id) {
          return (contexts.indexOf(poi.id) !== -1)
        } else {
          return false;
        }
      })
    );
  }

  public getPoiEntities(contexts: string[]) {
    return createSelector(
      this.getAllPoiEntities,
      pois => _.pickBy(pois, poi => {
        if (poi.id) {
          return (contexts.indexOf(poi.id) !== -1)
        } else {
          return false;
        }
      })
    );
  }

}
