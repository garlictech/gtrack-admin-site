import { Inject, Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { IExternalUserStatusDependencies, EXTERNAL_USER_STATUS_DEPENDENCIES } from '../externals';
import { IUserStatusState } from './state';

@Injectable()
export class UserStatusSelectors {
  public selectFeature: MemoizedSelector<object, IUserStatusState>;
  public getUserLocation: MemoizedSelector<object, GeoJSON.Position>;

  private _externals: IExternalUserStatusDependencies;

  constructor(
    @Inject(EXTERNAL_USER_STATUS_DEPENDENCIES)
    externals
  ) {
    this._externals = externals;
    this.selectFeature = createFeatureSelector<IUserStatusState>(this._externals.storeDomain);
    this.getUserLocation = createSelector(this.selectFeature, (state => state.location));
  }
}
