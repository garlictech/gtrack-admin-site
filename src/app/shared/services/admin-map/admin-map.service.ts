import { Store } from '@ngrx/store';
import { State } from '../../../store';
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
import {
  RouteInfoDataActions,
  AdminMapActions,
  RoutingActions
} from '../../../store/actions';
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
    private _adminMapActions: AdminMapActions,
    private _routeInfoDataActions: RouteInfoDataActions
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
      this._elevationService,
      this._routingActions,
      this._routeInfoDataActions
    );
    this._maps[_id] = _map;

    this._store.dispatch(this._adminMapActions.registerMap(_id));

    return _map;
  }

  getMapById(id: string) {
    return this._maps[id];
  }
}
