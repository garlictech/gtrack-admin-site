import { Injectable, Inject } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector, Store } from '@ngrx/store';
import { EXTERNAL_DEEPSTREAM_DEPENDENCIES, IExternalDeepstreamDependencies } from '../lib/externals';
import { IDeepstreamState, EDeepstreamState } from './state';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

export interface ISelectorUserData {
  userId: string | undefined;
  role: string;
}

@Injectable()
export class Selectors {
  public loggingIn;
  public loggedIn;
  public loggedOut;
  public failed;
  public getPermissionRecord;
  public userData: MemoizedSelector<any, ISelectorUserData>;
  public permissions;
  public permissionRecordName;
  public isOpenUser;
  private _externals: IExternalDeepstreamDependencies;

  constructor(@Inject(EXTERNAL_DEEPSTREAM_DEPENDENCIES) externals, private _store: Store<any>) {
    this._externals = externals;

    let selectFeature = createFeatureSelector<IDeepstreamState>(this._externals.storeDomain);

    this.permissions = createSelector(selectFeature, this._externals.selectors.getUserRole, (state, role) =>
      _.get(state, 'permissionRecord')
    );

    this.loggingIn = createSelector(
      selectFeature,
      this.permissions,
      (state, permissions) =>
        state.state === EDeepstreamState.LOGGING_IN || (_.get(state, 'auth.id') !== 'open' && permissions === null)
    );

    this.permissionRecordName = createSelector(selectFeature, state => _.get(state, 'auth.permissionRecord'));

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

    this.isOpenUser = createSelector(selectFeature, state => _.get(state, 'auth.id') === 'open');

    this.getPermissionRecord = Observable.combineLatest(
      this._store.select(this._externals.selectors.getUserRole),
      this._store.select(this.permissions).filter(permissions => !!permissions),
      (role, permissions) => _.get(permissions, role) || {}
    );
  }
}
