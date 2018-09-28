import { map, mergeMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import { RouteService } from '../../services/route';
import * as LocalActions from './actions';

@Injectable()
export class RouteEffects {
  @Effect()
  loadRoute$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.LoadRoute>(LocalActions.RouteActionTypes.LOAD_ROUTE),
    mergeMap(action => {
      return this._routeService.get(action.context).pipe(
        take(1),
        map(route => {
          if (route !== null) {
            return new LocalActions.RouteLoaded(action.context, route);
          }

          return new LocalActions.LoadRouteFailed(action.context);
        })
      );
    })
  );

  @Effect()
  saveRoute$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.SaveRoute>(LocalActions.RouteActionTypes.SAVE_ROUTE),
    mergeMap(action => {
      return this._routeService.create(action.route).pipe(
        take(1),
        map(response => new LocalActions.RouteSaved(response.id))
      );
    })
  );

  @Effect()
  updateState$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.UpdateRouteState>(LocalActions.RouteActionTypes.UPDATE_ROUTE_STATE),
    mergeMap(action => {
      return this._routeService.updateState(action.id, action.state).pipe(
        take(1),
        map(() => {
          return new LocalActions.LoadRoute(action.id);
        })
      );
    })
  );

  constructor(private _actions$: Actions, private _routeService: RouteService) {}
}
