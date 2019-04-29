// tslint:disable:no-property-initializers
import _omit from 'lodash-es/omit';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { PoiStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { PoiService } from '@features/common/poi';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { State } from '../';
import { log } from '../../log';
import { editedGTrackPoiActions } from '../actions';
import * as editedGTrackPoiSelectors from '../selectors/edited-gtrack-poi';

@Injectable()
export class EditedGTrackPoiEffects {
  @Effect() save$: Observable<Action> = this._actions$.pipe(
    ofType(editedGTrackPoiActions.SAVE_POI),
    switchMap(() =>
      this._store.pipe(
        select(editedGTrackPoiSelectors.getData),
        take(1)
      )
    ),
    switchMap((data: PoiStored) => {
      const poiData = _omit(data, ['timestamp']);

      return this._poiService.create(poiData).pipe(
        take(1),
        map(poi => new editedGTrackPoiActions.PoiSaveSuccess(poi.id)),
        catchError(error => {
          log.error('Effect: Poi save error: ', error);

          return of(new editedGTrackPoiActions.PoiSaveFailed(error));
        })
      );
    })
  );
  constructor(
    private readonly _actions$: Actions,
    private readonly _poiService: PoiService,
    private readonly _store: Store<State>
  ) {}
}
