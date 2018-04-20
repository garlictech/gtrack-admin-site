import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { HikeProgramService, HikeProgram, PoiSelectors } from 'subrepos/gtrack-common-ngx';
import { State, editedHikeProgramActions } from 'app/store';
import { IHikeProgramStored, IHikeProgram } from 'subrepos/provider-client';
import { log } from 'app/log';
import { EditedHikeProgramSelectors } from '../selectors/edited-hike-program';
import { IGTrackPoi } from '../../shared/interfaces';

import * as _ from 'lodash';

@Injectable()
export class EditedHikeProgramEffects {
  constructor(
    private _actions$: Actions,
    private _hikeProgramService: HikeProgramService,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _poiSelectors: PoiSelectors,
    private _store: Store<State>
  ) {
    /* EMPTY */
  }

  @Effect()
  save$: Observable<Action> = this._actions$
    .ofType(editedHikeProgramActions.SAVE_HIKE_PROGRAM)
    .switchMap(() => this._store.select(this._editedHikeProgramSelectors.getData).take(1))
    .switchMap((data: IHikeProgramStored) => {
      const hikeProgramData = _.omit(data, ['timestamp']);

      return this._hikeProgramService
        .save(<HikeProgram>hikeProgramData)
        .take(1)
        .map(() => new editedHikeProgramActions.HikeProgramSaveSuccess())
        .catch(error => {
          log.er('Effect: Hike program save error: ', error);
          return Observable.of(new editedHikeProgramActions.HikeProgramSaveFailed(error));
        });
    });

  @Effect()
  addPoi$: Observable<Action> = this._actions$
    .ofType(editedHikeProgramActions.ADD_POI)
    .map((action: editedHikeProgramActions.AddPoi) => action.poi)
    .switchMap((poiId) => this._store.select(this._poiSelectors.getPoi(poiId)).take(1))
    .switchMap((poi) => {
      const stop = {
        distanceFromOrigo: (<IGTrackPoi>poi).distFromRoute, // TODO: w/ turf
        isCheckpoint: false, // TODO: from checkpoint array
        onRoute: (<IGTrackPoi>poi).onRoute || false,
        poiId: (<IGTrackPoi>poi).id,
        lat: (<IGTrackPoi>poi).lat,
        lon: (<IGTrackPoi>poi).lon,
        segment: { // TODO: w/ turf
          uphill: 0,
          downhill: 0,
          distance: 0,
          score: 0,
          time: 0
        }
      }

      return Observable.of(new editedHikeProgramActions.AddStop(stop));
    });

  @Effect()
  removePoi$: Observable<Action> = this._actions$
    .ofType(editedHikeProgramActions.REMOVE_POI)
    .map((action: editedHikeProgramActions.AddPoi) => action.poi)
    .switchMap((poiId) => {
      return Observable.of(new editedHikeProgramActions.RemoveStopByPoiId(poiId));
    });
}
