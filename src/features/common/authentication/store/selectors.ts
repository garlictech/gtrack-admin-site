import { Injectable } from '@angular/core';

import _get from 'lodash-es/get';

import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DeepstreamSelectors } from '@bit/garlictech.angular-features.common.deepstream-ngx/src/store/selectors';

import { User } from '../interfaces';
import { Auth, AuthenticationState, featureName, JwtAuthState } from './state';

const selectAuthFeature = createFeatureSelector<AuthenticationState>(featureName);

const selectJwtFeature = createSelector(
  selectAuthFeature,
  (state: AuthenticationState) => state.jwtAuth
);

const selectAuth = createSelector(
  selectJwtFeature,
  (state: JwtAuthState) => state.auth
);

export const selectUser = createSelector(
  selectAuth,
  (state: Auth) => _get(state, 'user')
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

@Injectable({
  providedIn: 'root'
})
export class AuthenticationSelectors {
  auth: MemoizedSelector<object, Auth>;
  user: MemoizedSelector<object, User>;
  loggingIn: MemoizedSelector<object, boolean>;
  jwtLoggingIn: MemoizedSelector<object, boolean>;
  loggedIn: MemoizedSelector<object, boolean>;
  loggedOut: MemoizedSelector<object, boolean>;
  magicLinkEmailSent: MemoizedSelector<object, boolean>;
  loginFailed: MemoizedSelector<object, boolean>;
  role;
  selectedRole;
  token: MemoizedSelector<object, string>;
  termsAccepted: MemoizedSelector<object, boolean>;
  loginRefused: MemoizedSelector<object, boolean>;
  selectUserId: MemoizedSelector<object, string>;

  constructor(private readonly _deepstreamSelectors: DeepstreamSelectors) {
    const selectUiFeature = createSelector(
      selectAuthFeature,
      (state: AuthenticationState) => state.uiState
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
