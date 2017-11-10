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

  // TODOD vissza
  @Effect()
  addGeoJson$: Observable<Action> = this._actions$
    .ofType(HikeEditMapActions.ADD_GEOJSON)
    .withLatestFrom(this._store)
    .map(([action, state]) => state)
    .switchMap(state => {
      const _adminMap: AdminMap = this._adminMapService.getMapById(state.hikeEditMap.mapId);
      const _buffer = _adminMap.getBuffer();

      if (_buffer) {
        const _geoJson = _adminMap.addGeoJSON(_buffer);
        return Observable.of(this._hikeEditMapActions.geoJsonAdded(_geoJson));
      } else {
        return Observable.of(this._hikeEditMapActions.error('Empty buffer'));
      }
    });

  @Effect()
  removeGeoJson$: Observable<Action> = this._actions$
    .ofType(HikeEditMapActions.REMOVE_GEOJSON)
    .withLatestFrom(this._store)
    .map(([action, state]) => state)
    .switchMap(state => {
      const adminMap: AdminMap = this._adminMapService.getMapById(state.hikeEditMap.mapId);
      if (state.hikeEditMap.geoJsonOnMap) {
        adminMap.removeGeoJSON(state.hikeEditMap.geoJsonOnMap);
        return Observable.of(this._hikeEditMapActions.geoJsonRemoved());
      } else {
        return Observable.of(this._hikeEditMapActions.error('geoJson is null'));
      }
    });
}
