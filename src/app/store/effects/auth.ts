import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';
import { RouterActions } from 'subrepos/gtrack-common-ngx/app/router';

import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private _actions$: Actions,
    private _router: Router
  ) {}

  // Auth guard route forbidden
  @Effect()
  routeForbidden$: Observable<any> = this._actions$
    .ofType(AuthActions.ROUTE_FORBIDDEN)
    .switchMap(data => {
      this._router.navigate(['/login']);

      return Observable.empty();
    });

  // Login
  @Effect()
  loginSuccess$: Observable<any> = this._actions$
    .ofType(AuthActions.LOGIN_SUCCESS)
    .filter(() => this._router.url === '/login')
    .switchMap(data => {
      this._router.navigate(['/']);

      return Observable.empty();
    });

  // Logout
  @Effect()
  logoutSuccess$: Observable<any> = this._actions$
    .ofType(AuthActions.LOGOUT_SUCCESS)
    .switchMap(data => {
      this._router.navigate(['/login']);

      return Observable.empty();
    });
}
