import { Injectable, Inject } from '@angular/core';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { EXTERNAL_DEEPSTREAM_DEPENDENCIES, IExternalDeepstreamDependencies } from '../lib/externals';
import { IDeepstreamState, EDeepstreamState } from './state';

@Injectable()
export class Selectors {
  public loggingIn;
  public loggedIn;
  public loggedOut;
  public failed;
  public userData;
  public permissions;
  private _externals: IExternalDeepstreamDependencies;

  constructor(@Inject(EXTERNAL_DEEPSTREAM_DEPENDENCIES) externals) {
    this._externals = externals;

    let selectFeature = createFeatureSelector<IDeepstreamState>(this._externals.storeDomain);

    this.loggingIn = createSelector(selectFeature, (state): boolean => state.state === EDeepstreamState.LOGGING_IN);

    this.permissions = createSelector(selectFeature, state => state.permissionRecord);

    this.loggedIn = createSelector(
      selectFeature,
      this.permissions,
      (state, permissions) => state.state === EDeepstreamState.LOGGED_IN && !!permissions
    );

    this.loggedOut = createSelector(selectFeature, state => state.state === EDeepstreamState.LOGGED_OUT);

    this.failed = createSelector(selectFeature, state => state.failure);

    this.userData = createSelector(
      this._externals.selectors.getUserId,
      this._externals.selectors.getUserRole,
      (userId, role) => {
        return { userId, role };
      }
    );
  }
}
