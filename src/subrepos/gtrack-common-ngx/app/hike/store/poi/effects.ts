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
        .take(1)
        .map(poi => {
          return new LocalActions.PoiLoaded(action.context, poi);
        });
    });

  @Effect()
  loadPois$: Observable<Action> = this._actions$
    .ofType<LocalActions.LoadPois>(LocalActions.PoiActionTypes.LOAD_POIS)
    .mergeMap(action => {
      return Observable
        .combineLatest(...action.contexts.map(context => {
          return this._poiService
            .get(context);
        }))
        .take(1)
        .map(pois => {
          return new LocalActions.AllPoiLoaded(action.contexts, pois);
        });
    });

  @Effect()
  savePoi$: Observable<Action> = this._actions$
    .ofType<LocalActions.SavePoi>(LocalActions.PoiActionTypes.SAVE_POI)
    .mergeMap(action => {
      return this._poiService
        .create(action.poi)
        .take(1)
        .map(response => new LocalActions.PoiSaved(response.id));
    });

  @Effect()
  updateState$: Observable<Action> = this._actions$
    .ofType<LocalActions.UpdatePoiState>(LocalActions.PoiActionTypes.UPDATE_POI_STATE)
    .mergeMap(action => {
      return this._poiService
        .updateState(action.id, action.state)
        .take(1)
        .map(result => {
          return new LocalActions.LoadPoi(action.id);
        });
    });

  @Effect()
  deletePoi$: Observable<Action> = this._actions$
    .ofType<LocalActions.DeletePoi>(LocalActions.PoiActionTypes.DELETE_POI)
    .mergeMap(action => {
      return this._poiService
        .delete(action.id)
        .take(1)
        .map(result => {
          return new LocalActions.PoiDeleted(action.id);
        });
    });

  @Effect()
  mergePoi$: Observable<Action> = this._actions$
    .ofType<LocalActions.MergePoi>(LocalActions.PoiActionTypes.MERGE_POI)
    .mergeMap(action => {

      delete action.newData.additionalData;
      console.log('merge action', action);
      return this._poiService
        .merge(action.ids, action.newData)
        .take(1)
        .map(result => {
          console.log('merge res', result);
          return new LocalActions.PoiMerged(result, action.ids);
        });
    });

  constructor(private _actions$: Actions, private _poiService: PoiService, private _store: Store<any>) {}
}
