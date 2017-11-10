import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { HikeEditRoutePlanningActions } from './actions';

@Injectable()
export class HikeEditRoutePlanningEffects {
  constructor(
    private _actions$: Actions
  ) {}

  @Effect()
    saveRoute$: Observable<Action> = this._actions$
      .ofType(HikeEditRoutePlanningActions.SAVE_ROUTE)
      .map(toPayload)
      .switchMap(data => {
        console.log('EFFECT for HikeEditRoutePlanningActions.SAVE_ROUTE');

        return Observable.empty<Response>();
      });
}
