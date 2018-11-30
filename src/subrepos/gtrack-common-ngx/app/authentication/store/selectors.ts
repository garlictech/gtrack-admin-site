import { Injectable } from '@angular/core';

import _get from 'lodash-es/get';

import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { Selectors as DeepstreamSelectors } from '../../../../deepstream-ngx';

import { User, IAuthenticationState as IJwtAuthState, IAuth } from '../../../../authentication-api-ngx';

import { IAuthenticationState } from './state';

const selectAuthFeature = createFeatureSelector<IAuthenticationState>('authentication');

const selectJwtFeature = createSelector(
  selectAuthFeature,
  (state: IAuthenticationState) => state.jwtAuth
);

const selectAuth = createSelector(
  selectJwtFeature,
  (state: IJwtAuthState) => state.auth
);

export const selectUser = createSelector(
  selectAuth,
  (state: IAuth) => _get(state, 'user')
);

export const selectRole = createSelector(
  selectUser,
  (user: User) => _get(user, 'roles[0]')
);
export const selectUserId = createSelector(
  selectUser,
  (user: User) => _get(user, 'id')
);
export const loggedOut = createSelector(
  selectUser,
  user => !user
);

@Injectable()
export class Selectors {
  public auth: MemoizedSelector<object, IAuth>;
  public user: MemoizedSelector<object, User>;
  public loggingIn: MemoizedSelector<object, boolean>;
  public jwtLoggingIn: MemoizedSelector<object, boolean>;
  public loggedIn: MemoizedSelector<object, boolean>;
  public loggedOut: MemoizedSelector<object, boolean>;
  public magicLinkEmailSent: MemoizedSelector<object, boolean>;
  public loginFailed: MemoizedSelector<object, boolean>;
  public role;
  public selectedRole;
  public token: MemoizedSelector<object, string>;
  public termsAccepted: MemoizedSelector<object, boolean>;
  public loginRefused: MemoizedSelector<object, boolean>;
  public selectUserId: MemoizedSelector<object, string>;

  constructor(private _deepstreamSelectors: DeepstreamSelectors) {
    const selectUiFeature = createSelector(
      selectAuthFeature,
      (state: IAuthenticationState) => state.uiState
    );

    this.auth = selectAuth;
    this.user = selectUser;

    this.jwtLoggingIn = createSelector(
      selectJwtFeature,
      jwtState => jwtState.loggingIn
    );

    this.loggingIn = createSelector(
      this.jwtLoggingIn,
      this._deepstreamSelectors.loggingIn,
      (jwtLoggingIn, dsState) => jwtLoggingIn || dsState
    );

    this.loggedOut = loggedOut;

    this.token = createSelector(
      selectAuth,
      state => _get(state, 'token')
    );

    this.loggedIn = createSelector(
      this.token,
      this._deepstreamSelectors.loggedIn,
      (token, dsState) => !!token && dsState
    );

    this.magicLinkEmailSent = createSelector(
      selectJwtFeature,
      state => state.emailSent
    );

    this.loginFailed = createSelector(
      selectJwtFeature,
      this._deepstreamSelectors.failed,
      (jwtState, deepstreamFailed) => jwtState.failed || !!deepstreamFailed
    );

    this.role = selectRole;
    this.selectUserId = selectUserId;

    this.selectedRole = createSelector(
      selectUiFeature,
      state => state.selectedRole
    );

    this.termsAccepted = createSelector(
      selectUiFeature,
      state => state.termsAccepted
    );

    this.loginRefused = createSelector(
      selectUiFeature,
      state => state.loginRefused
    );
  }
}
