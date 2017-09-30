import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Actions as AuthActions } from 'authentication-api-ngx';
import * as GtActions from './actions';

@Injectable()
export class Effects {
  constructor(
    private _actions$: Actions
  ) {}

  // Save hike
  @Effect()
  routeForbidden$: Observable<Action> = this._actions$
    .ofType(AuthActions.ROUTE_FORBIDDEN)
    .map(toPayload)
    .switchMap(data => {
      console.log('sROUTE_FORBIDDEN ', data);

      return Observable.empty<Response>();
    });

  // Save hike
  @Effect()
  saveHike$: Observable<Action> = this._actions$
    .ofType(GtActions.SAVE_HIKE)
    .map(toPayload)
    .switchMap(data => {
      console.log('saveHike EFFECT: Save hike data: ', data);

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
