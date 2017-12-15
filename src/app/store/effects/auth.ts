import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';
import * as RouterActions from 'subrepos/gtrack-common-ngx';

import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(private _actions$: Actions, private _router: Router) {}

  // Auth guard route forbidden
  @Effect()
  routeForbidden$: Observable<Action> = this._actions$
    .ofType(AuthActions.ROUTE_FORBIDDEN)
    .map(toPayload)
    .switchMap(data => {
      return Observable.of(new RouterActions.Go({ path: ['/login'] }));
    });

  // Login
  @Effect()
  loginSuccess$: Observable<Action> = this._actions$
    .ofType(AuthActions.LOGIN_SUCCESS)
    .map(toPayload)
    .switchMap(data => {
      if (this._router.url === '/login') {
        return Observable.of(new RouterActions.Go({ path: ['/'] }));
      } else {
        return Observable.empty();
      }
    });

  // Logut
  @Effect()
  logoutSuccess$: Observable<Action> = this._actions$
    .ofType(AuthActions.LOGOUT_SUCCESS)
    .map(toPayload)
    .switchMap(data => {
      return Observable.of(new RouterActions.Go({ path: ['/login'] }));
    });
}
