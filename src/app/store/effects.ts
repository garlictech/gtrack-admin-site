import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Actions as AuthActions } from 'authentication-api-ngx';
import * as GtActions from './actions';
import { go } from '@ngrx/router-store';
import { Router } from '@angular/router';

@Injectable()
export class Effects {
  constructor(
    private _actions$: Actions,
    private _router: Router
  ) {}

  // Auth guard route forbidden
  @Effect()
  routeForbidden$: Observable<Action> = this._actions$
    .ofType(AuthActions.ROUTE_FORBIDDEN)
    .map(toPayload)
    .switchMap(data => {
      return Observable.of(go(['/login']));
    });

  // Login
  @Effect()
  loginSuccess$: Observable<Action> = this._actions$
    .ofType(AuthActions.LOGIN_SUCCESS)
    .map(toPayload)
    .switchMap(data => {
      if (this._router.url === '/login') {
        return Observable.of(go(['/']));
      } else {
        return Observable.of(true);
      }
    });

  // Logut
  @Effect()
  logoutSuccess$: Observable<Action> = this._actions$
    .ofType(AuthActions.LOGOUT_SUCCESS)
    .map(toPayload)
    .switchMap(data => {
      return Observable.of(go(['/login']));
    });

  // Save hike
  @Effect()
  saveHike$: Observable<Action> = this._actions$
    .ofType(GtActions.SAVE_HIKE)
    .map(toPayload)
    .switchMap(data => {
      return Observable.empty<Response>();
    });

  // Delete hike
  @Effect()
  deleteHike$: Observable<Action> = this._actions$
    .ofType(GtActions.DELETE_HIKE)
    .map(toPayload)
    .switchMap(data => {
      return Observable.empty<Response>();
    });
}
