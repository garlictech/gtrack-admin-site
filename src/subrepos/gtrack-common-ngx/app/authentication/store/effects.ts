
import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Actions as jwtActions, IAuth } from 'subrepos/authentication-api-ngx';
import { DeepstreamService } from 'subrepos/deepstream-ngx';

import * as LocalActions from 'subrepos/deepstream-ngx/src/store/actions';
import * as _ from 'lodash';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenticationEffects {
  @Effect()
  deepstreamLoginAfterJwtLogin$: Observable<Action> = this._actions$
    .ofType(jwtActions.LOGIN_SUCCESS)
    .map(toPayload)
    .map((auth: IAuth) => _.get(auth, 'token', null))
    .filter(token => (token !== null))
    .map((token: string) => {
      return new LocalActions.DeepstreamLogin(token);
    })
    .catch(err => {
      return Observable.of(new LocalActions.DeepstreamLoginFailed(err));
    });

  @Effect()
  deepstreamLogoutAfterJwtLogout$: Observable<Action> = this._actions$
    .ofType(jwtActions.LOGOUT_START)
    .map(toPayload)
    .switchMap(() => {
      return this._deepstreamService.getClient().close();
    })
    .switchMap(() => this._deepstreamService.getClient().login({ jwtToken: null }))
    .map(() => {
      return new LocalActions.DeepstreamLogoutSuccess();
    });

  constructor(
    private _actions$: Actions,
    private _deepstreamService: DeepstreamService
  ) {}
}
