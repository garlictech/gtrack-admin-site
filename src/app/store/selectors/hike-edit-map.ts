import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { IHikeEditMapState } from '../state/hike-edit-map';

@Injectable()
export class HikeEditMapSelectors {
  private _featureSelector: MemoizedSelector<object, IHikeEditMapState>;
  public getMapId: MemoizedSelector<object, string>;

  constructor() {
    this._featureSelector = createFeatureSelector<IHikeEditMapState>('hikeEditMap');

    this.getMapId = createSelector(this._featureSelector, (state: IHikeEditMapState) => state.mapId);
  }
}
