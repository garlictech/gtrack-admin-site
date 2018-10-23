import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { PoiService } from 'subrepos/gtrack-common-ngx';
import { State } from '..';
import { editedGTrackPoiActions } from '../actions';
import { IPoiStored, IPoi } from 'subrepos/provider-client';
import { log } from '../../log';

import { EditedGTrackPoiSelectors } from '../selectors';
import _omit from 'lodash-es/omit';

@Injectable()
export class EditedGTrackPoiEffects {
  constructor(
    private _actions$: Actions,
    private _poiService: PoiService,
    private _editedGTrackPoiSelectors: EditedGTrackPoiSelectors,
    private _store: Store<State>
  ) {}

  @Effect()
  save$: Observable<Action> = this._actions$.pipe(
    ofType(editedGTrackPoiActions.SAVE_POI),
    switchMap(() =>
      this._store.pipe(
        select(this._editedGTrackPoiSelectors.getData),
        take(1)
      )
    ),
    switchMap((data: IPoiStored) => {
      const poiData = _omit(data, ['timestamp']);

      return this._poiService.create(<IPoi>poiData).pipe(
        take(1),
        map(poi => new editedGTrackPoiActions.PoiSaveSuccess(poi.id)),
        catchError(error => {
          log.error('Effect: Poi save error: ', error);
          return of(new editedGTrackPoiActions.PoiSaveFailed(error));
        })
      );
    })
  );
}
