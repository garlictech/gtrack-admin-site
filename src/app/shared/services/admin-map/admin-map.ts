import { Store } from '@ngrx/store';
import { State, Actions } from '../../../store';
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
import * as L from 'leaflet';

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
    private _elevationService: ElevationService,
    private _actions: Actions
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
      this._routeInfo,
      this._actions
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

  public addGeoJSON(geojson) {
    const res = L.geoJSON(geojson, {
      style: this._geoJsonStyle(geojson),
      onEachFeature: this._propagateClick
    });
    res.addTo(this.leafletMap);
    return res;
  }

  public removeGeoJSON(geojson) {
    this.map.removeLayer(geojson);
  }

  private _geoJsonStyle(feature) {
    let style;
    switch (feature.properties.draw_type) {
      case 'small_buffer':
        style = { color: '#000044', weight: 2, fillColor: '#000077' };
        break;
      case 'route_0':
        style = { color: 'black', opacity: 0.15, weight: 9 };
        break;
      case 'route_1':
        style = { color: 'white', opacity: 0.8, weight: 6 };
        break;
      case 'route_2':
        style = { color: 'red', opacity: 1, weight: 2 };
        break;
    }
    return style;
  }

  private _propagateClick(feature, layer) {
    layer.on('click', event => {
      this.map.fireEvent('click', {
        latlng: event.latlng,
        layerPoint: this.map.latLngToLayerPoint(event.latlng),
        containerPoint: this.map.latLngToContainerPoint(event.latlng)
      });
    });
  }
}
