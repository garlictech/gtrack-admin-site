import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { State } from '../index';
import { IHikeEditGeneralInfoState, IGeneralInfoState, IHikeEditRoutePlannerState } from '../state/index';
import { ITextualDescriptionItem } from 'app/shared/interfaces';
import { descriptionAdapter } from '../reducer/hike-edig-general-info';
import { ISegment } from 'subrepos/gtrack-common-ngx';

@Injectable()
export class HikeEditRoutePlannerSelectors {
  private _featureSelector: MemoizedSelector<object, IHikeEditRoutePlannerState>;
  public getRoutePlanner: MemoizedSelector<object, IHikeEditRoutePlannerState>;
  public getSegments: MemoizedSelector<object, ISegment[]>;

  constructor() {
    this._featureSelector = createFeatureSelector<IHikeEditRoutePlannerState>('hikeEditRoutePlanner');

    this.getRoutePlanner = createSelector(this._featureSelector,
      (state: IHikeEditRoutePlannerState) => state
    );

    this.getSegments = createSelector(this._featureSelector,
      (state: IHikeEditRoutePlannerState) => state.segments
    );
  }
}
