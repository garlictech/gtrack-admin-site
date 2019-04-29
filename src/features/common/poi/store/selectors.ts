import _get from 'lodash-es/get';
import _pickBy from 'lodash-es/pickBy';

import { Injectable } from '@angular/core';
import { PoiData, PoiStored } from '@features/common/gtrack-interfaces';
import { Dictionary } from '@ngrx/entity/src/models';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { featureName, poiAdapter, PoiContextState, poiContextStateAdapter, PoiState } from './state';

@Injectable()
export class PoiSelectors {
  selectFeature: MemoizedSelector<object, PoiState>;
  getPoiIds: (state: object) => Array<string> | Array<number>;
  getAllPois: (state: object) => Array<PoiStored>;
  getAllPoiEntities: (state: object) => Dictionary<PoiData>;
  getAllContexts: (state: object) => Array<PoiContextState>;
  getAllContextEntities: (state: object) => Dictionary<PoiContextState>;
  protected _selectPoiEntities: (state: object) => Dictionary<PoiStored>;

  constructor() {
    this.selectFeature = createFeatureSelector<PoiState>(featureName);

    const poiSelector = createSelector(
      this.selectFeature,
      (state: PoiState) => state.pois
    );
    const contextSelector = createSelector(
      this.selectFeature,
      (state: PoiState) => state.contexts
    );

    const selectors = poiAdapter.getSelectors(poiSelector);
    const contextSelectors = poiContextStateAdapter.getSelectors(contextSelector);

    this.getPoiIds = selectors.selectIds;
    this.getAllPois = selectors.selectAll;
    this.getAllPoiEntities = selectors.selectEntities;
    this.getAllContexts = contextSelectors.selectAll;
    this.getAllContextEntities = contextSelectors.selectEntities;
    this._selectPoiEntities = selectors.selectEntities;
  }

  getPoi(context: string): MemoizedSelector<object, PoiData> {
    return createSelector(
      this.getAllPois,
      (pois: Array<PoiData>) => pois.find(poi => poi.id === context)
    );
  }

  getAllPoisCount(): MemoizedSelector<object, number> {
    return createSelector(
      this.getAllPois,
      (pois: Array<PoiData>) => (pois || []).length
    );
  }

  getAllPoiPhotos(): MemoizedSelector<object, Array<any>> {
    return createSelector(
      this.getAllPois,
      pois => {
        let photos = [];

        pois.forEach(poi => {
          photos = photos.concat(_get(poi, 'additionalData.photos', []));
        });

        return photos;
      }
    );
  }

  getPoiContext(context: string): MemoizedSelector<object, PoiContextState> {
    return createSelector(
      this.getAllContexts,
      (contexts: Array<PoiContextState>) => contexts.find(c => c.id === context)
    );
  }

  getPoiContexts(contexts: Array<string>): MemoizedSelector<object, Array<PoiContextState>> {
    return createSelector(
      this.getAllContexts,
      poiContexts =>
        poiContexts.filter(context => {
          if (context.id) {
            return contexts.indexOf(context.id) !== -1;
          } else {
            return false;
          }
        })
    );
  }

  getPoiContextEntities(ids: Array<string>): MemoizedSelector<object, any> {
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

  getPois(contexts: Array<string>): MemoizedSelector<object, Array<PoiStored>> {
    return createSelector(
      this.getAllPois,
      pois =>
        pois.filter(poi => {
          if (poi.id) {
            return contexts.indexOf(poi.id) !== -1;
          } else {
            return false;
          }
        })
    );
  }

  getPoiEntities(contexts: Array<string>): MemoizedSelector<object, any> {
    return createSelector(
      this.getAllPoiEntities,
      pois =>
        _pickBy(pois, poiEntity => {
          if (poiEntity.id) {
            return contexts.indexOf(poiEntity.id) !== -1;
          } else {
            return false;
          }
        })
    );
  }
}
