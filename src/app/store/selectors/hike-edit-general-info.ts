import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { State } from '../index';
import { IHikeEditGeneralInfoState, IGeneralInfoState } from '../state/index';
import { ITextualDescriptionItem } from 'app/shared/interfaces';
import { descriptionAdapter } from '../reducer/hike-edit-general-info';

@Injectable()
export class HikeEditGeneralInfoSelectors {
  private _featureSelector: MemoizedSelector<object, IHikeEditGeneralInfoState>;
  public getGeneralInfo: MemoizedSelector<object, IGeneralInfoState>;
  public getInitialized: MemoizedSelector<object, boolean>;
  public getHikeId: MemoizedSelector<object, string>;
  public getRouteId: MemoizedSelector<object, string>;
  public getPois: MemoizedSelector<object, string[]>;
  public getAllDescriptions: (state: object) => ITextualDescriptionItem[];

  constructor() {
    this._featureSelector = createFeatureSelector<IHikeEditGeneralInfoState>('hikeEditGeneralInfo');

    //
    // General info
    //

    this.getGeneralInfo = createSelector(this._featureSelector,
      (state: IHikeEditGeneralInfoState) => state.generalInfo
    );

    this.getInitialized = createSelector(this._featureSelector,
      (state: IHikeEditGeneralInfoState) => state.generalInfo.initialized
    );

    this.getHikeId = createSelector(this._featureSelector,
      (state: IHikeEditGeneralInfoState) => state.generalInfo.hikeId
    );

    this.getRouteId = createSelector(this._featureSelector,
      (state: IHikeEditGeneralInfoState) => state.generalInfo.routeId
    );

    this.getPois = createSelector(this._featureSelector,
      (state: IHikeEditGeneralInfoState) => state.generalInfo.pois
    );

    //
    // Descriptions
    //

    const descriptionSelector = createSelector(
      this._featureSelector, (state: IHikeEditGeneralInfoState) => state.descriptions
    );
    this.getAllDescriptions = descriptionAdapter.getSelectors(descriptionSelector).selectAll;
  }

  public getHikePois<IPoi>(getAllSelector: ((state: object) => IPoi[])) {
    return createSelector(
      getAllSelector,
      this.getPois,
      (data, poiIds) => {
        if (typeof poiIds !== 'undefined') {
          return data.filter(item => poiIds.indexOf((<any>item).id) !== -1);
        }
      }
    )
  }
}
