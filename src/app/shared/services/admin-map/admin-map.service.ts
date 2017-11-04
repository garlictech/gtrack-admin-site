import { Store } from '@ngrx/store';
import { State, Actions } from '../../../store';
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
    private _actions: Actions
  ) {
    super(iconService, mapMarkerService);
  }

  public get(leafletMap: L.Map, id: string): AdminMap {
    const map = new AdminMap(
      leafletMap,
      this.iconService,
      this.mapMarkerService,
      this._store,
      this._gameRuleService,
      this._routeService,
      this._elevationService,
      this._actions
    );
    this._maps[id] = map;

    return map;
  }

  getMapById(id: string) {
    return this._maps[id];
  }
}
