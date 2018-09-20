import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

@Injectable()
export class AuthEffects {
  constructor(
    private _actions$: Actions,
    private _router: Router
  ) {}

  // Auth guard route forbidden
  @Effect()
  routeForbidden$: Observable<any> = this._actions$
    .pipe(
      ofType(AuthActions.ROUTE_FORBIDDEN),
      switchMap(data => {
        this._router.navigate(['/login']);

        return EMPTY;
      })
    );

  // Login
  @Effect()
  loginSuccess$: Observable<any> = this._actions$
    .pipe(
      ofType(AuthActions.LOGIN_SUCCESS),
      filter(() => this._router.url === '/login'),
      switchMap(data => {
        this._router.navigate(['/']);

        return EMPTY;
      })
    );

  // Logout
  @Effect()
  logoutSuccess$: Observable<any> = this._actions$
    .pipe(
      ofType(AuthActions.LOGOUT_SUCCESS),
      switchMap(data => {
        this._router.navigate(['/login']);

        return EMPTY;
      })
    );
}
