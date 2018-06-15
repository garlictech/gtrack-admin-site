import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IDeepstreamState } from 'subrepos/gtrack-common-ngx/app/deepstream';

import { Selectors as DeepstreamSelectors } from 'subrepos/deepstream-ngx';

import { User, IAuthenticationState as IJwtAuthState, IAuth } from 'subrepos/authentication-api-ngx';

import { IAuthenticationState } from './state';

let selectAuthFeature = createFeatureSelector<IAuthenticationState>('authentication');

let selectJwtFeature = createSelector(selectAuthFeature, (state: IAuthenticationState) => state.jwtAuth);

let selectAuth = createSelector(selectJwtFeature, (state: IJwtAuthState) => state.auth);

export const selectUser = createSelector(selectAuth, (state: IAuth) => _.get(state, 'user'));

export const selectRole = createSelector(selectUser, (user: User) => _.get(user, 'roles[0]'));
export const selectUserId = createSelector(selectUser, (user: User) => _.get(user, 'id'));

@Injectable()
export class Selectors {
  public auth;
  public user;
  public loggingIn;
  public jwtLoggingIn;
  public loggedIn;
  public loggedOut;
  public magicLinkEmailSent;
  public loginFailed;
  public role;
  public selectedRole;
  public token;
  public termsAccepted;
  public loginRefused;
  public selectUserId;

  constructor(private _deepstreamSelectors: DeepstreamSelectors) {
    let selectDeepstreamFeature = createFeatureSelector<IDeepstreamState>('deepstream');

    let selectUiFeature = createSelector(selectAuthFeature, (state: IAuthenticationState) => state.uiState);

    this.auth = selectAuth;
    this.user = selectUser;

    this.jwtLoggingIn = createSelector(selectJwtFeature, jwtState => jwtState.loggingIn);

    this.loggingIn = createSelector(
      this.jwtLoggingIn,
      this._deepstreamSelectors.loggingIn,
      (jwtLoggingIn, dsState) => jwtLoggingIn || dsState
    );

    this.loggedOut = createSelector(this.user, user => !user);

    this.token = createSelector(selectAuth, state => _.get(state, 'token'));

    this.loggedIn = createSelector(
      this.token,
      this._deepstreamSelectors.loggedIn,
      (token, dsState) => !!token && dsState
    );

    this.magicLinkEmailSent = createSelector(selectJwtFeature, state => state.emailSent);

    this.loginFailed = createSelector(
      selectJwtFeature,
      this._deepstreamSelectors.failed,
      (jwtState, deepstreamFailed) => jwtState.failed || !!deepstreamFailed
    );

    this.role = selectRole;
    this.selectUserId = selectUserId;

    this.selectedRole = createSelector(selectUiFeature, state => state.selectedRole);

    this.termsAccepted = createSelector(selectUiFeature, state => state.termsAccepted);

    this.loginRefused = createSelector(selectUiFeature, state => state.loginRefused);
  }
}
