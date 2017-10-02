import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Actions as AuthActions } from 'authentication-api-ngx';
import * as GtActions from './actions';
import { go } from '@ngrx/router-store';

@Injectable()
export class Effects {
  constructor(
    private _actions$: Actions
  ) {}

  // Auth guard route forbidden
  @Effect()
  routeForbidden$: Observable<Action> = this._actions$
    .ofType(AuthActions.ROUTE_FORBIDDEN)
    .map(toPayload)
    .switchMap(data => {
      console.log('sROUTE_FORBIDDEN ', data);
      return Observable.of(go(['/login']));

    });

  // Login
  @Effect()
  loginSuccess$: Observable<Action> = this._actions$
    .ofType(AuthActions.LOGIN_SUCCESS)
    .map(toPayload)
    .switchMap(data => {
      return Observable.of(go(['/']));
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

  // Delet hike
  @Effect()
  deleteHike$: Observable<Action> = this._actions$
    .ofType(GtActions.DELETE_HIKE)
    .map(toPayload)
    .switchMap(data => {
      console.log('deleteHike EFFECT: Delete hike by id: ', data);

      return Observable.empty<Response>();
    });
}
