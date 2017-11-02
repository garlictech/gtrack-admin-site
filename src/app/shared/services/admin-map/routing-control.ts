import { Store } from '@ngrx/store';
import { State, GtActions } from '../../../store';
import { environment } from '../../../../environments/environment';
import { RouteInfo } from './route-info';
import {
  ElevationService,
  RouteService
} from '../../../../subrepos/gtrack-common-ngx/app';

import * as L from 'leaflet';
import 'leaflet-spin';
import 'leaflet-routing-machine';
import 'lrm-valhalla';
import 'lrm-valhalla/src/L.Routing.Valhalla.Formatter';

export class RoutingControl {
  private _controls: Array<L.Routing.Control>;
  private _coordinates: Array<any>;

  constructor(
    private _leafletMap: L.Map,
    private _store: Store<State>,
    private _elevationService: ElevationService,
    private _routeService: RouteService,
    private _routeInfo: RouteInfo
  ) {
    this._reset();
  }

  private _reset() {
    this._controls = [];
    this._coordinates = [];
  }

  public clearControls() {
    while (this._controls.length > 0) {
      this.pop();
    }
  }

  public getActualControl() {
    return this._controls[this._controls.length - 1];
  }

  /*
  private _getActualControlNum() {
    return this._controls.length;
  }
  */

  public getControl(index) {
    return this._controls[index];
  }

  public pop() {
    const indexToRemove = this._controls.length - 1;
    const control = this._controls.pop();

    this._leafletMap.removeControl(control);

    if (this._routeInfo.planner) {
      this._routeInfo.planner.removeLastSegment();
    }

    return control;
  }

  private _createMarker(name, latLng) {
    const icon = L.divIcon({
      html: `<span>${name}</span>`,
      iconSize: [25, 41],
      iconAnchor: [13, 41]
    });

    const marker = L.marker(latLng, {
      opacity: 1,
      draggable: true,
      icon: icon
    });

    marker.addTo(this._leafletMap);

    return marker;
  }

  public addNew() {
    const control: L.Routing.Control = new L.Routing.Control({
      routeWhileDragging: true,
      autoRoute: false,
      fitSelectedRoutes: 'smart',
      router: L.Routing.valhalla(environment.valhalla.apiKey, 'pedestrian'),
      formatter: new L.Routing.Valhalla.Formatter(),
      plan: new L.Routing.Plan([], {
        createMarker: (waypointNum, waypoint) => {
          return this._createMarker(waypoint.name, waypoint.latLng);
        }
      })
    });

    control.addTo(this._leafletMap);
    control.hide();

    control.on('routingstart', () => {
      this._store.dispatch(new GtActions.RoutingStartAction());
      this._leafletMap.spin(true);
    });

    control.on('routesfound', (e) => {
      this._elevationService.getData(e.routes[0].coordinates).then(data => {
        const upDown = {
          uphill: this._elevationService.calculateUphill(data),
          downhill: this._elevationService.calculateDownhill(data)
        };
        this._routeInfo.planner.addRouteSegment(data, e.routes[0].summary, upDown);

        this._store.dispatch(new GtActions.RoutingFinishedAction());
        this._leafletMap.spin(false);
      }).catch(() => {
        this._store.dispatch(new GtActions.RoutingErrorAction());
        this._leafletMap.spin(false);
      });
    });

    control.on('routingerror', (e) => {
      this._store.dispatch(new GtActions.RoutingErrorAction());
      this._leafletMap.spin(false);
    });

    this._controls.push(control);

    return control;
  }
}
