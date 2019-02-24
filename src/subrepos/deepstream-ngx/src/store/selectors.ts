import { Inject, Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { EXTERNAL_DEEPSTREAM_DEPENDENCIES, IExternalDeepstreamDependencies } from '../lib/externals';
import { EDeepstreamState, IDeepstreamState } from './state';

import _get from 'lodash-es/get';

import { combineLatest } from 'rxjs';

export interface ISelectorUserData {
  userId: string | undefined;
  role: string;
}

@Injectable()
export class Selectors {
  loggingIn: MemoizedSelector<object, boolean>;
  loggedIn: MemoizedSelector<object, boolean>;
  loggedOut;
  failed;
  getPermissionRecord;
  userData: MemoizedSelector<any, ISelectorUserData>;
  permissions;
  permissionRecordName;
  isOpenUser;
  private readonly _externals: IExternalDeepstreamDependencies;

  constructor(@Inject(EXTERNAL_DEEPSTREAM_DEPENDENCIES) externals, private readonly _store: Store<any>) {
    this._externals = externals;

    const selectFeature = createFeatureSelector<IDeepstreamState>(this._externals.storeDomain);

    this.permissions = createSelector(
      selectFeature,
      this._externals.selectors.getUserRole,
      (state, role) => _get(state, 'permissionRecord')
    );

    this.loggingIn = createSelector(
      selectFeature,
      this.permissions,
      (state, permissions) =>
        state.state === EDeepstreamState.LOGGING_IN || (_get(state, 'auth.id') !== 'open' && permissions === null)
    );

    this.permissionRecordName = createSelector(
      selectFeature,
      state => _get(state, 'auth.permissionRecord')
    );

    this.loggedIn = createSelector(
      selectFeature,
      this.permissions,
      (state, permissions) => state.state === EDeepstreamState.LOGGED_IN && !!permissions
    );

    this.loggedOut = createSelector(
      selectFeature,
      state => state.state === EDeepstreamState.LOGGED_OUT
    );

    this.failed = createSelector(
      selectFeature,
      state => state.failure
    );

    this.userData = createSelector(
      this._externals.selectors.getUserId,
      this._externals.selectors.getUserRole,
      (userId, role) => ({ userId, role })
    );

    this.isOpenUser = createSelector(
      selectFeature,
      state => _get(state, 'auth.id') === 'open'
    );

    this.getPermissionRecord = combineLatest(
      this._store.pipe(select(this._externals.selectors.getUserRole)),
      this._store.pipe(
        select(this.permissions),
        filter(permissions => !!permissions)
      )
    ).pipe(map((role, permissions) => _get(permissions, role) || {}));
  }
}
