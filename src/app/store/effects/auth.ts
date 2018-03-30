import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';
import { RouterActions } from 'subrepos/gtrack-common-ngx/app/router';

import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(private _actions$: Actions, private _router: Router) {}

  // Auth guard route forbidden
  @Effect()
  routeForbidden$: Observable<Action> = this._actions$.ofType(AuthActions.ROUTE_FORBIDDEN).switchMap(data => {
    return Observable.of(new RouterActions.Go(['/login']));
  });

  // Login
  @Effect()
  loginSuccess$: Observable<Action> = this._actions$
    .ofType(AuthActions.LOGIN_SUCCESS)
    .filter(() => this._router.url === '/login')
    .switchMap(data => {
      return Observable.of(new RouterActions.Go(['/']));
    });

  // Logut
  @Effect()
  logoutSuccess$: Observable<Action> = this._actions$.ofType(AuthActions.LOGOUT_SUCCESS).switchMap(data => {
    return Observable.of(new RouterActions.Go(['/login']));
  });
}
