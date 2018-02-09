import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action, Store, createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { Actions as jwtActions, IAuth, IAuthenticationState  } from 'subrepos/authentication-api-ngx';
import { DeepstreamService } from 'subrepos/deepstream-ngx';

import * as DeepstreamActions from 'subrepos/deepstream-ngx/src/store/actions';
import * as _ from 'lodash';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenticationAgents {
  private _jwtLoggingInSelector: MemoizedSelector<object, boolean>;
  private _tokenSelector: MemoizedSelector<object, string>;


  constructor(
    private _actions$: Actions,
    private _deepstreamService: DeepstreamService,
    private _store: Store<any>
  ) {

    let authSelector = createFeatureSelector<IAuthenticationState>('jwtAuthentication');

    this._jwtLoggingInSelector = createSelector(authSelector, (state => state.loggingIn));
    this._tokenSelector = createSelector(authSelector, state => _.get(state, 'auth.token', '') as string);
  }

  public start() {
    this._store.select(this._jwtLoggingInSelector)
      .filter(loggingIn => !loggingIn)
      .switchMapTo(this._store.select(this._tokenSelector))
      .subscribe(token => this._store.dispatch(new DeepstreamActions.DeepstreamLogin(token)))
  }
}
