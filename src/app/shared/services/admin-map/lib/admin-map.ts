import { Store } from '@ngrx/store';
import { State } from 'app/store';
import { HikeEditRoutePlannerSelectors } from 'app/store/selectors';
import { RoutingControl } from './routing-control';
import { WaypointMarker } from './waypoint-marker';
import { RouteInfo } from './route-info';
import { RoutePlanner } from './route-planner';
import {
  Map, IconService, MapMarkerService, GameRuleService, RouteService, ElevationService
} from 'subrepos/gtrack-common-ngx/app';

import * as L from 'leaflet';
import * as turf from '@turf/turf';
import * as _ from 'lodash';

export class AdminMap extends Map {
  private _routingControl: RoutingControl;
  private _waypointMarker: WaypointMarker;
  private _routeInfo: RouteInfo;
  private _routePlanner: RoutePlanner;

  constructor(
    public id: string,
    protected map: L.Map,
    protected iconService: IconService,
    protected mapMarkerService: MapMarkerService,
    private _store: Store<State>,
    private _gameRuleService: GameRuleService,
    private _routeService: RouteService,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _elevationService: ElevationService
  ) {
    super(id, map, iconService, mapMarkerService);

    this._routeInfo = new RouteInfo(
      this._gameRuleService,
      this._routeService,
      this._hikeEditRoutePlannerSelectors,
      this._store
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

  /**
   * Get buffer geoJSON
   */
  public getBuffer(): GeoJSON.Feature<GeoJSON.Polygon> | undefined {
    const _path = this._routeInfo.getPath();

    if (typeof _path !== 'undefined') {
      let _buffer = <GeoJSON.Feature<GeoJSON.Polygon>>turf.buffer(
        _path, 50, {units: 'meters'}
      );

      if (typeof _buffer !== 'undefined') {
        _buffer = _.assign(_buffer, {
          properties: {
            name: 'buffer polygon',
            draw_type: 'small_buffer'
          }
        });
      }

      return _buffer;
    } else {
      return;
    }
  }

  /**
   * Add buffer geoJSON to map
   */
  public addGeoJSON(geoJson): L.GeoJSON {
    const _geoJSON = L.geoJSON(geoJson, {
      style: this._getGeoJsonStyle(geoJson),
      onEachFeature: this._propagateClick
    });
    _geoJSON.addTo(this.leafletMap);

    return _geoJSON;
  }

  /**
   * addGeoJSON submethod
   */
  private _getGeoJsonStyle(feature) {
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

  /**
   * addGeoJSON submethod
   */
  private _propagateClick(feature, layer) {
    layer.on('click', event => {
      this.map.fireEvent('click', {
        latlng: event.latlng,
        layerPoint: this.map.latLngToLayerPoint(event.latlng),
        containerPoint: this.map.latLngToContainerPoint(event.latlng)
      });
    });
  }

  /**
   * Remove buffer geoJSON from map
   */
  public removeGeoJSON(geojson) {
    if (geojson) {
      this.map.removeLayer(geojson);
    }
  }
}
