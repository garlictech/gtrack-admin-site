import { Inject, Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { poiAdapter, IPoiState, IPoiContextState } from './state';
import { EXTERNAL_POI_DEPENDENCIES, IExternalPoiDependencies } from '../../externals';
import { poiContextStateAdapter } from './state';
import { IPoi, IPoiStored } from '../../../../../provider-client';
import { Dictionary } from '@ngrx/entity/src/models';

<<<<<<< HEAD
import _get from 'lodash-es/get';
import _pickBy from 'lodash-es/pickBy';
=======
import * as _ from 'lodash';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

@Injectable()
export class PoiSelectors {
  public selectFeature: MemoizedSelector<object, IPoiState>;
  public getPoiIds: (state: object) => string[] | number[];
  public getAllPois: (state: object) => IPoiStored[];
  public getAllPoiEntities: (state: object) => Dictionary<IPoi>;
  public getAllContexts: (state: object) => IPoiContextState[];
  public getAllContextEntities: (state: object) => Dictionary<IPoiContextState>;
  protected _selectPoiEntities: (state: object) => Dictionary<IPoiStored>;
  protected _externals: IExternalPoiDependencies;

  constructor(@Inject(EXTERNAL_POI_DEPENDENCIES) externals) {
    this._externals = externals;

    this.selectFeature = createFeatureSelector<IPoiState>(this._externals.storeDomain);

    const poiSelector = createSelector(this.selectFeature, (state: IPoiState) => state.pois);
    const contextSelector = createSelector(this.selectFeature, (state: IPoiState) => state.contexts);

    const selectors = poiAdapter.getSelectors(poiSelector);
    const contextSelectors = poiContextStateAdapter.getSelectors(contextSelector);

    this.getPoiIds = selectors.selectIds;
    this.getAllPois = selectors.selectAll;
    this.getAllPoiEntities = selectors.selectEntities;
    this.getAllContexts = contextSelectors.selectAll;
    this.getAllContextEntities = contextSelectors.selectEntities;
    this._selectPoiEntities = selectors.selectEntities;
  }

  public getPoi(context: string) {
    return createSelector(this.getAllPois, (pois: IPoi[]) => pois.find(poi => poi.id === context));
  }

  public getAllPoisCount() {
    return createSelector(this.getAllPois, (pois: IPoi[]) => (pois || []).length);
  }

  public getAllPoiPhotos() {
    return createSelector(this.getAllPois, pois => {
      let photos = [];

      pois.forEach(poi => {
        photos = photos.concat(_get(poi, 'additionalData.photos', []));
      });

      return photos;
    });
  }

  public getPoiContext(context: string) {
    return createSelector(this.getAllContexts, (contexts: IPoiContextState[]) => {
      return contexts.find(c => c.id === context);
    });
  }

  public getPoiContexts(contexts: string[]) {
    return createSelector(this.getAllContexts, poiContexts =>
      poiContexts.filter(context => {
        if (context.id) {
          return contexts.indexOf(context.id) !== -1;
        } else {
          return false;
        }
      })
    );
  }

  public getPois(contexts: string[]) {
    return createSelector(this.getAllPois, pois =>
      pois.filter(poi => {
        if (poi.id) {
          return contexts.indexOf(poi.id) !== -1;
        } else {
          return false;
        }
      })
    );
  }

  public getPoiEntities(contexts: string[]) {
    return createSelector(this.getAllPoiEntities, pois =>
      _pickBy(pois, poi => {
        if (poi.id) {
          return contexts.indexOf(poi.id) !== -1;
        } else {
          return false;
        }
      })
    );
  }
}
