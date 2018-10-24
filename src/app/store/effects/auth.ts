import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { routingActions } from '../actions';

@Injectable()
export class AuthEffects {
  constructor(private _actions$: Actions, private _router: Router) {}

  // Auth guard route forbidden
  @Effect()
  routeForbidden$: Observable<any> = this._actions$.pipe(
    ofType(AuthActions.ROUTE_FORBIDDEN),
    switchMap(data => {
      return of(new routingActions.Go(['/login']));
    })
  );

  // Login
  @Effect()
  loginSuccess$: Observable<any> = this._actions$.pipe(
    ofType(AuthActions.LOGIN_SUCCESS),
    filter(() => {
      return this._router.url === '/login';
    }),
    switchMap(() => {
      return of(new routingActions.Go(['/']));
    })
  );

  // Logout
  @Effect()
  logoutSuccess$: Observable<any> = this._actions$.pipe(
    ofType(AuthActions.LOGOUT_SUCCESS),
    switchMap(() => {
      return of(new routingActions.Go(['/login']));
    })
  );
}
