import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { HikeProgramService, GeospatialService } from 'subrepos/gtrack-common-ngx';
import { State } from '..';
import { editedHikeProgramActions } from '../actions';
import { IHikeProgramStored, IHikeProgram } from 'subrepos/provider-client';
import { log } from '../../log';
import { EditedHikeProgramSelectors } from '../selectors/edited-hike-program';
import { HikeEditRoutePlannerSelectors } from '../selectors';

import _omit from 'lodash-es/omit';

@Injectable()
export class EditedHikeProgramEffects {
  constructor(
    private _actions$: Actions,
    private _hikeProgramService: HikeProgramService,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _geospatialService: GeospatialService,
    private _store: Store<State>
  ) {}

  /**
   * Prepare stop from poi then add to store
   */
  @Effect()
  prepareThenAddStop$: Observable<Action> = this._actions$
    .ofType(editedHikeProgramActions.PREPARE_THEN_ADD_STOP)
    .map((action: editedHikeProgramActions.PrepareThenAddStop) => action.poi)
    .switchMap(poi => {
      return this._store
        .select(this._hikeEditRoutePlannerSelectors.getPath)
        .take(1)
        .map((path) => {
          const stop = {
            distanceFromOrigo: this._geospatialService.distanceOnLine(
              path.geometry.coordinates[0],
              [poi.lon, poi.lat],
              path
            ),
            onRoute: poi.onRoute || false,
            poiId: poi.id,
            lat: poi.lat,
            lon: poi.lon,
            // Segment data will be calculated after inserting the stop
            segment: {
              uphill: 0,
              downhill: 0,
              distance: 0,
              score: 0,
              time: 0
            }
          }

          return new editedHikeProgramActions.AddStop(stop);
        })
    });

  @Effect()
  save$: Observable<Action> = this._actions$
    .ofType(editedHikeProgramActions.SAVE_HIKE_PROGRAM)
    .switchMap(() => this._store.select(this._editedHikeProgramSelectors.getData).take(1))
    .switchMap((data: IHikeProgramStored) => {
      const hikeProgramData = _omit(data, ['timestamp']);

      return this._hikeProgramService
        .save(<IHikeProgram>hikeProgramData)
        .take(1)
        .map(() => new editedHikeProgramActions.HikeProgramSaveSuccess())
        .catch(error => {
          log.er('Effect: Hike program save error: ', error);
          return Observable.of(new editedHikeProgramActions.HikeProgramSaveFailed(error));
        });
    });
}
