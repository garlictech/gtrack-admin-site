import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { State } from '../index';
import { IHikeEditGeneralInfoState, IGeneralInfoState } from '../state/index';
import { ITextualDescriptionItem } from 'app/shared/interfaces';
import { descriptionAdapter } from '../reducer/hike-edig-general-info';

@Injectable()
export class HikeEditGeneralInfoSelectors {
  private _featureSelector: MemoizedSelector<object, IHikeEditGeneralInfoState>;
  public getGeneralInfo: MemoizedSelector<object, IGeneralInfoState>;
  public getHikeId: MemoizedSelector<object, string>;
  public getRouteId: MemoizedSelector<object, string>;
  public getPois: MemoizedSelector<object, string[]>;
  public getAllDescriptions: (state: object) => ITextualDescriptionItem[];
  public getAllLangKeys: (state: object) => string[] | number[];

  constructor() {
    this._featureSelector = createFeatureSelector<IHikeEditGeneralInfoState>('hikeEditGeneralInfo');

    //
    // General info
    //

    this.getGeneralInfo = createSelector(this._featureSelector,
      (state: IHikeEditGeneralInfoState) => state.generalInfo
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
    this.getAllLangKeys = descriptionAdapter.getSelectors(descriptionSelector).selectIds;
  }
}
