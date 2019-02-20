// tslint:disable:no-property-initializers
import _omit from 'lodash-es/omit';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { GeospatialService, HikeProgramService, RouteActionTypes } from 'subrepos/gtrack-common-ngx';
import { IHikeProgramStored } from 'subrepos/provider-client';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { State } from '../';
import { log } from '../../log';
import { commonRouteActions, editedHikeProgramActions } from '../actions';
import * as editedHikeProgramSelectors from '../selectors/edited-hike-program';
import * as hikeEditRoutePlannerSelectors from '../selectors/hike-edit-route-planner';

@Injectable()
export class EditedHikeProgramEffects {
  /**
   * Prepare stop from poi then add to store
   */
  @Effect() prepareThenAddStop$: Observable<Action> = this._actions$.pipe(
    ofType(editedHikeProgramActions.PREPARE_THEN_ADD_STOP),
    map((action: editedHikeProgramActions.PrepareThenAddStop) => action.poi),
    switchMap(poi =>
      this._store.pipe(
        select(hikeEditRoutePlannerSelectors.getPath),
        take(1),
        map(path => {
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
      )
    )
  );

  @Effect() save$: Observable<Action> = this._actions$.pipe(
    ofType(editedHikeProgramActions.SAVE_HIKE_PROGRAM),
    switchMap(() =>
      this._store.pipe(
        select(editedHikeProgramSelectors.getData),
        take(1)
      )
    ),
    switchMap((data: IHikeProgramStored) => {
      const hikeProgramData = _omit(data, ['timestamp']);

      return this._hikeProgramService.save(hikeProgramData).pipe(
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
  @Effect() loadSavedRoute$: Observable<Action> = this._actions$.pipe(
    ofType<commonRouteActions.RouteSaved>(RouteActionTypes.ROUTE_SAVED),
    map(action => new commonRouteActions.LoadRoute(action.context))
  );
  constructor(
    private readonly _actions$: Actions,
    private readonly _hikeProgramService: HikeProgramService,
    private readonly _geospatialService: GeospatialService,
    private readonly _store: Store<State>
  ) {}
}
