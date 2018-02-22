import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { hikeEditRoutePlannerActions } from '../index';

@Injectable()
export class HikeEditRoutePlannerEffects {
  constructor(
    private _actions$: Actions
  ) {}

  @Effect()
    saveRoute$: Observable<Action> = this._actions$
      .ofType(hikeEditRoutePlannerActions.SAVE_ROUTE)
      .map(toPayload)
      .switchMap(data => {
        return Observable.empty<Response>();
      });
}
