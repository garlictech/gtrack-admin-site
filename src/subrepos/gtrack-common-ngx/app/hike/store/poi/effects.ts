import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';

import { PoiService } from '../../services/poi/poi.service';
import * as LocalActions from './actions';

@Injectable()
export class PoiEffects {
  @Effect()
  loadPoi$: Observable<Action> = this._actions$
    .ofType<LocalActions.LoadPoi>(LocalActions.PoiActionTypes.LOAD_POI)
    .mergeMap(action => {
      return this._poiService
        .get(action.context)
        .map(poi => {
          return new LocalActions.PoiLoaded(action.context, poi);
        });
    });

    @Effect()
    loadPois$: Observable<Action> = this._actions$
      .ofType<LocalActions.LoadPois>(LocalActions.PoiActionTypes.LOAD_POIS)
      .mergeMap(action => {
        return Observable
          .forkJoin(...action.contexts.map(context => {
            return this._poiService
              .get(context);
          }))
          .map(pois => {
            return new LocalActions.AllPoiLoaded(action.contexts, pois);
          });
      });

    @Effect()
    createPoi$: Observable<Action> = this._actions$
      .ofType<LocalActions.CreatePoi>(LocalActions.PoiActionTypes.CREATE_POI)
      .mergeMap(action => {
        return this._poiService
          .create(action.poi)
          .map(response => new LocalActions.PoiCreated(response.id));
      });

    @Effect()
    loadCreatedPoi$: Observable<Action> = this._actions$
      .ofType<LocalActions.PoiCreated>(LocalActions.PoiActionTypes.POI_CREATED)
      .map(action => (new LocalActions.LoadPoi(action.context)));

  constructor(private _actions$: Actions, private _poiService: PoiService, private _store: Store<any>) {
    /* EMPTY */
  }
}
