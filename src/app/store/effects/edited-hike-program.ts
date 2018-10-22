import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, catchError } from 'rxjs/operators';
import { HikeProgramService, GeospatialService, RouteActionTypes } from 'subrepos/gtrack-common-ngx';
import { State } from '..';
import { editedHikeProgramActions, commonRouteActions } from '../actions';
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
    .pipe(
      ofType(editedHikeProgramActions.PREPARE_THEN_ADD_STOP),
      map((action: editedHikeProgramActions.PrepareThenAddStop) => action.poi),
      switchMap(poi => {
        return this._store
          .pipe(
            select(this._hikeEditRoutePlannerSelectors.getPath),
            take(1),
            map((path) => {
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
              };
              return new editedHikeProgramActions.AddStop(stop);
            })
          );
      })
    );

  @Effect()
  save$: Observable<Action> = this._actions$
    .pipe(
      ofType(editedHikeProgramActions.SAVE_HIKE_PROGRAM),
      switchMap(() => this._store.pipe(
        select(this._editedHikeProgramSelectors.getData),
        take(1))
      ),
      switchMap((data: IHikeProgramStored) => {
        const hikeProgramData = _omit(data, ['timestamp']);

        return this._hikeProgramService
          .save(<IHikeProgram>hikeProgramData)
          .pipe(
            take(1),
            map(() => new editedHikeProgramActions.HikeProgramSaveSuccess()),
            catchError(error => {
              log.error('Effect: Hike program save error: ', error);
              return of(new editedHikeProgramActions.HikeProgramSaveFailed(error));
            })
          );
      })
    );

  /**
   * Load route after save
   */
  @Effect()
  loadSavedRoute$: Observable<Action> = this._actions$
    .pipe(
      ofType<commonRouteActions.RouteSaved>(RouteActionTypes.ROUTE_SAVED),
      map(action => new commonRouteActions.LoadRoute(action.context))
    );
}
