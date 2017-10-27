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

@Injectable()
export class AdminMapService extends MapService {
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

  get(map: L.Map): AdminMap {
    return new AdminMap(
      map,
      this.iconService,
      this.mapMarkerService,
      this._store,
      this._gameRuleService,
      this._routeService,
      this._elevationService
    );
  }
}
