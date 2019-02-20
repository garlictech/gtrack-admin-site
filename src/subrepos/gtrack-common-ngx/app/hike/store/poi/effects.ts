// tslint:disable:no-property-initializers
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map, mergeMap, take } from 'rxjs/operators';

import { PoiService } from '../../services/poi/poi.service';
import * as LocalActions from './actions';

@Injectable()
export class PoiEffects {
  @Effect() loadPoi$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.LoadPoi>(LocalActions.PoiActionTypes.LOAD_POI),
    mergeMap(action =>
      this._poiService.get(action.context).pipe(
        take(1),
        map(poi => new LocalActions.PoiLoaded(action.context, poi))
      )
    )
  );

  @Effect() loadPois$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.LoadPois>(LocalActions.PoiActionTypes.LOAD_POIS),
    mergeMap(action =>
      observableCombineLatest(...action.contexts.map(context => this._poiService.get(context))).pipe(
        take(1),
        map(pois => new LocalActions.AllPoiLoaded(action.contexts, pois))
      )
    )
  );

  @Effect() savePoi$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.SavePoi>(LocalActions.PoiActionTypes.SAVE_POI),
    mergeMap(action =>
      this._poiService.create(action.poi).pipe(
        take(1),
        map(response => new LocalActions.PoiSaved(response.id))
      )
    )
  );

  @Effect() updateState$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.UpdatePoiState>(LocalActions.PoiActionTypes.UPDATE_POI_STATE),
    mergeMap(action =>
      this._poiService.updateState(action.id, action.state).pipe(
        take(1),
        map(() => new LocalActions.LoadPoi(action.id))
      )
    )
  );

  @Effect() deletePoi$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.DeletePoi>(LocalActions.PoiActionTypes.DELETE_POI),
    mergeMap(action =>
      this._poiService.delete(action.id).pipe(
        take(1),
        map(() => new LocalActions.PoiDeleted(action.id))
      )
    )
  );

  @Effect() mergePoi$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.MergePoi>(LocalActions.PoiActionTypes.MERGE_POI),
    mergeMap(action =>
      this._poiService.merge(action.ids, action.newData).pipe(
        take(1),
        map(result => {
          if (result.success) {
            // Reducer will removes the merged pois, then the next effect load the new poi
            return new LocalActions.PoiMergedSuccessfully(result, action.ids);
          } else {
            return new LocalActions.PoiMergeFailed(result);
          }
        })
      )
    )
  );

  constructor(private readonly _actions$: Actions, private readonly _poiService: PoiService) {}
}
