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
  retrievePlan$: Observable<Action> = this._actions$
    .ofType(HikeEditRoutePlanningActions.RETRIEVE_PLAN)
    .map(toPayload)
    .switchMap(data => {
      console.log('EFFECT for HikeEditRoutePlanningActions.RETRIEVE_PLAN');
      /*
      if (this._router.url === '/login') {
        return Observable.of(go(['/']));
      } else {
        return Observable.empty<Response>();
      }*/
      return Observable.empty<Response>();
    });

  @Effect()
    removeLast$: Observable<Action> = this._actions$
      .ofType(HikeEditRoutePlanningActions.REMOVE_LAST)
      .map(toPayload)
      .switchMap(data => {
        console.log('EFFECT for HikeEditRoutePlanningActions.REMOVE_LAST');

        return Observable.empty<Response>();
      });

  @Effect()
    closeCircle$: Observable<Action> = this._actions$
      .ofType(HikeEditRoutePlanningActions.CLOSE_CIRCLE)
      .map(toPayload)
      .switchMap(data => {
        console.log('EFFECT for HikeEditRoutePlanningActions.CLOSE_CIRCLE');

        return Observable.empty<Response>();
      });

  @Effect()
    deletePlan$: Observable<Action> = this._actions$
      .ofType(HikeEditRoutePlanningActions.DELETE_PLAN)
      .map(toPayload)
      .switchMap(data => {
        console.log('EFFECT for HikeEditRoutePlanningActions.DELETE_PLAN');

        return Observable.empty<Response>();
      });

  @Effect()
    saveRoute$: Observable<Action> = this._actions$
      .ofType(HikeEditRoutePlanningActions.SAVE_ROUTE)
      .map(toPayload)
      .switchMap(data => {
        console.log('EFFECT for HikeEditRoutePlanningActions.SAVE_ROUTE');

        return Observable.empty<Response>();
      });
}
