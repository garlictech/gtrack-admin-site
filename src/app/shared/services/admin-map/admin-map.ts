import { Store } from '@ngrx/store';
import { State } from '../../../store';
import { RoutingControl } from './routing-control';
import { WaypointMarker } from './waypoint-marker';
import { RouteInfo } from './route-info';
import { RoutePlanner } from './route-planner';
import {
  Map,
  IconService,
  MapMarkerService,
  GameRuleService,
  RouteService,
  ElevationService
} from '../../../../subrepos/gtrack-common-ngx/app';

export class AdminMap extends Map {
  private _routingControl: RoutingControl;
  private _waypointMarker: WaypointMarker;
  private _routeInfo: RouteInfo;
  private _routePlanner: RoutePlanner;

  constructor(
    protected map: L.Map,
    protected iconService: IconService,
    protected mapMarkerService: MapMarkerService,
    private _store: Store<State>,
    private _gameRuleService: GameRuleService,
    private _routeService: RouteService,
    private _elevationService: ElevationService
  ) {
    super(map, iconService, mapMarkerService);

    this._routeInfo = new RouteInfo(
      this._gameRuleService,
      this._routeService
    );

    this._routingControl = new RoutingControl(
      this.leafletMap,
      this._store,
      this._elevationService,
      this._routeService,
      this._routeInfo
    );

    this._waypointMarker = new WaypointMarker(
      this._routeInfo,
      this._routingControl
    );
  }

  public get routeInfo(): RouteInfo {
    return this._routeInfo;
  }

  public get routingControl(): RoutingControl {
    return this._routingControl;
  }

  public get waypointMarker(): WaypointMarker {
    return this._waypointMarker;
  }
}
