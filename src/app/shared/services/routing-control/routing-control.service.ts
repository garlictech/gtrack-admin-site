import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { Map } from '../../../../subrepos/gtrack-common-ngx';

import * as L from 'leaflet';
import * as Routing from 'leaflet-routing-machine';

@Injectable()
export class RoutingControlService {
  private _controls: Array<any>;
  private _coordinates: Array<any>;

  constructor(
    private _map: Map
  ) {
    this._reset();
  }

  private _reset() {
    this._controls = [];
    this._coordinates = [];
  }

  public clearControls() {
    while (this._controls.length > 0) {
      this._pop();
    }
  }

  public getActualControl() {
    return this._controls[this._controls.length - 1];
  }

  private _getActualControlNum() {
    return this._controls.length;
  }

  public getControl(index) {
    return this._controls[index];
  }

  private _pop() {
    const indexToRemove = this._controls.length - 1;
    const control = this._controls.pop();

    this._map.leafletMap.removeControl(control);

    /*
    if (RouteService.planner) {
      RouteService.planner.removeLastSegment();
    }
    */

    return control;
  }

  private _createMarker(name, latLng) {
    const icon = L.divIcon({
      // type: 'div',
      iconSize: [30, 30],
      html: name,
      iconAnchor: [30, 0]
    });

    const marker = L.marker(latLng, {
      opacity: 1,
      draggable: true,
      icon: icon
    });

    marker.addTo(this._map.leafletMap);

    return marker;
  }

  public addNew() {
    const control = Routing.control({
      routeWhileDragging: true,
      autoRoute: false,
      fitSelectedRoutes: false,
      router: Routing.valhalla(environment.valhalla.apiKey, 'pedestrian'),
      formatter: new Routing.Valhalla.Formatter(),
      plan: Routing.plan([], {
        createMarker: (waypointNum, waypoint, c) => {
          this._createMarker(waypoint.name, waypoint.latLng);
        }
      })
    });

    /*
    MapService.map().then (map) ->
      control.addTo map
      .hide()
    */

    control.on('routingstart', () => {
      console.log('Routing start');
      /*
      $rootScope.$broadcast "ROUTING:START"
      // STORE !!!
      MapService.busy()
      */
    });

    control.on('routesfound', (e) => {
      console.log('Routes found - TODO: Rewrite coffee');
      /*
      ElevationService.get(e.routes[0].coordinates).then (data) ->
        upDown = ElevationService.calculateUpDownhill data
        RouteService.planner.addRouteSegment data, e.routes[0].summary, upDown
        $rootScope.$broadcast "ROUTING:FINISHED"
      .catch ->
        $rootScope.$broadcast "ROUTING:ERROR"
      .finally ->
        MapService.free()
      */
    });

    control.on('routingerror', (e) => {
      console.log('Routing error - TODO: Rewrite coffee');
      /*
      $rootScope.$broadcast "ROUTING:ERROR"
      MapService.free()
      */
    });

    this._controls.push(control);

    return control;
  }
}
