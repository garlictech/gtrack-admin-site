import { Store } from '@ngrx/store';
import { State, RoutingActions, AdminMapActions } from '../../../store';
import { Injectable } from '@angular/core';
import { AdminMap } from './admin-map';
import {
  IconService,
  MapMarkerService,
  MapService,
  GameRuleService,
  RouteService,
  ElevationService
} from '../../../../subrepos/gtrack-common-ngx/app';

import * as uuid from 'uuid';

@Injectable()
export class AdminMapService extends MapService {
  protected _maps: {[id: string]: AdminMap} = {};

  constructor(
    protected iconService: IconService,
    protected mapMarkerService: MapMarkerService,
    private _store: Store<State>,
    private _gameRuleService: GameRuleService,
    private _routeService: RouteService,
    private _elevationService: ElevationService,
    private _routingActions: RoutingActions,
    private _adminMapActions: AdminMapActions
  ) {
    super(iconService, mapMarkerService);
  }

  public get(leafletMap: L.Map): AdminMap {
    const id = uuid();
    const map = new AdminMap(
      id,
      leafletMap,
      this.iconService,
      this.mapMarkerService,
      this._store,
      this._gameRuleService,
      this._routeService,
      this._elevationService,
      this._routingActions
    );
    this._maps[id] = map;

    this._store.dispatch(this._adminMapActions.registerMap(id));

    return map;
  }

  getMapById(id: string) {
    return this._maps[id];
  }
}
