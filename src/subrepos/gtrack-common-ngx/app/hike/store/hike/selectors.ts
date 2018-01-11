import { Inject, Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import * as _ from 'lodash';

import { hikeAdapter, hikeContextStateAdapter, IHikeState, IHikeContextState } from './state';
import { EXTERNAL_HIKE_DEPENDENCIES, IExternalHikeDependencies } from '../../externals';
import { Dictionary } from '@ngrx/entity/src/models';
import { PoiSelectors } from '../poi/selectors';
import { HikeProgram, IHikeProgram, HikeProgramService  } from '../../services/hike-program';
import { Poi } from '../../services/poi';
import { RouterSelectors } from '../../../router';

@Injectable()
export class HikeSelectors {
  public selectFeature: MemoizedSelector<object, IHikeState>;
  public getHikeIds: (state: object) => string[] | number[];
  public getAllHikes: (state: object) => IHikeProgram[];
  public getAllContexts: (state: object) => IHikeContextState[];

  private _selectContextEntities: (state: object) => Dictionary<IHikeContextState>;
  private _selectHikeEntities: (state: object) => Dictionary<IHikeProgram>;
  private _externals: IExternalHikeDependencies;

  constructor(
    @Inject(EXTERNAL_HIKE_DEPENDENCIES) externals,
    private _poiSelectors: PoiSelectors,
    private _routerSelectors: RouterSelectors,
    private _hikeProgramService: HikeProgramService
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
    return createSelector(this.getAllHikes, (hikes: IHikeProgram[]) => (hikes.find(hike => (hike.id === context))));
  }

  public getSelectedHike() {
    return createSelector(
      this._selectHikeEntities,
      this._routerSelectors.getRouterState,
      (hikes, router): IHikeProgram => {
        return (router.state && hikes[router.state.params.id]);
      }
    )
  }

  public getSelectedHikeLoaded() {
    return createSelector(
      this._selectContextEntities,
      this._routerSelectors.getRouterState,
      (contexts, router): boolean => {
        let context = (router.state && contexts[router.state.params.id]);
        return _.get(context, 'loaded', false);
      }
    );
  }
}