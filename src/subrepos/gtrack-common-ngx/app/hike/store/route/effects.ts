import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';

import * as _ from 'lodash';

import { RouteService, Route } from '../../services/route';
import * as LocalActions from './actions';
import * as PoiActions from '../poi/actions';

@Injectable()
export class RouteEffects {
  @Effect()
  loadRoute$: Observable<Action> = this._actions$
    .ofType<LocalActions.LoadRoute>(LocalActions.RouteActionTypes.LOAD_ROUTE)
    .mergeMap(action => {
      return this._routeService
        .get(action.context)
        .map(route => {
          console.log(route);
          if (route !== null) {
            return new LocalActions.RouteLoaded(action.context, route);
          }

          return new LocalActions.LoadRouteFailed(action.context);
        });
    });

  constructor(private _actions$: Actions, private _routeService: RouteService, private _store: Store<any>) {
    /* EMPTY */
  }
}
