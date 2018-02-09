import { Store } from '@ngrx/store';
import { State, adminMapActions } from 'app/store';
import { Injectable } from '@angular/core';
import { AdminMap } from './lib/admin-map';
import {
  IconService,
  MapMarkerService,
  MapService,
  GameRuleService,
  RouteService,
  ElevationService
} from 'subrepos/gtrack-common-ngx/app';

import * as uuid from 'uuid/v4';

@Injectable()
export class AdminMapService extends MapService {
  protected _maps: {[id: string]: AdminMap} = {};

  constructor(
    protected iconService: IconService,
    protected mapMarkerService: MapMarkerService,
    private _store: Store<State>,
    private _gameRuleService: GameRuleService,
    private _routeService: RouteService,
    private _elevationService: ElevationService
  ) {
    super(iconService, mapMarkerService);
  }

  public get(leafletMap: L.Map): AdminMap {
    const _id = uuid();
    const _map = new AdminMap(
      _id,
      leafletMap,
      this.iconService,
      this.mapMarkerService,
      this._store,
      this._gameRuleService,
      this._routeService,
      this._elevationService
    );
    this._maps[_id] = _map;

    this._store.dispatch(new adminMapActions.RegisterMap({
      mapId: _id
    }));

    return _map;
  }

  getMapById(id: string) {
    return this._maps[id];
  }
}
