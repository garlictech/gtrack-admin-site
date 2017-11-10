import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { HikeEditMapActions, IHikeEditMapState, hikeEditMapDomain } from './index';
import { AdminMapService, AdminMap } from '../../shared/services/admin-map';
import { State } from '../index';

@Injectable()
export class HikeEditMapEffects {
  constructor(
    private _actions$: Actions,
    private _store: Store<any>,
    private _adminMapService: AdminMapService,
    private _hikeEditMapActions: HikeEditMapActions
  ) {}

  @Effect()
  toggleCurrentPositionMarker$: Observable<void> = this._actions$
    .ofType(HikeEditMapActions.TOGGLE_CURRENT_POSITION_MARKER)
    .withLatestFrom(this._store)
    .map(([action, state]) => state)
    .switchMap(state => {
      const adminMap: AdminMap = this._adminMapService.getMapById(state.hikeEditMap.mapId);

      adminMap.currentPositionMarker.goToCurrentPosition();

      return Observable.of<void>();
    });

  @Effect()
    resetMap$: Observable<Action> = this._actions$
      .ofType(HikeEditMapActions.RESET_MAP)
      .withLatestFrom(this._store)
      .map(([action, state]) => state)
      .switchMap(state => {
        const adminMap: AdminMap = this._adminMapService.getMapById(state.hikeEditMap.mapId);

        adminMap.fitBounds(adminMap.routeInfo.getTrack());

        return Observable.of(this._hikeEditMapActions.mapReseted());
      });

  @Effect()
  toggleBuffer$: Observable<Action> = this._actions$
    .ofType(HikeEditMapActions.TOGGLE_BUFFER)
    .withLatestFrom(this._store)
    .map(([action, state]) => state)
    .switchMap(state => {
      const adminMap: AdminMap = this._adminMapService.getMapById(state.hikeEditMap.mapId);

      if (state.hikeEditMap.bufferShown) {
        return Observable.of(this._hikeEditMapActions.geoJsonAdded(
          // Payload is the returned geojson object
          adminMap.addGeoJSON(adminMap.getBuffer())
        ));
      } else {
        adminMap.removeGeoJSON(state.hikeEditMap.geoJsonOnMap);
        return Observable.of(this._hikeEditMapActions.geoJsonRemoved());
      }
    });
}
