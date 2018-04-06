import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ElevationService } from 'subrepos/gtrack-common-ngx';
import { State, hikeEditRoutePlannerActions, routingActions } from 'app/store';
import { HikeEditRoutePlannerSelectors, HikeEditMapSelectors } from 'app/store/selectors';
import { AdminMapService, AdminMap, RoutePlannerService } from './index';
import { environment } from 'environments/environment';

import * as _ from 'lodash';
import * as L from 'leaflet';
import 'leaflet-spin';
import 'leaflet-routing-machine';
import 'lrm-graphhopper';

@Injectable()
export class RoutingControlService {
  private _controls: Array<L.Routing.Control>;
  private _coordinates: Array<any>;
  private _map: AdminMap;

  constructor(
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _routePlannerService: RoutePlannerService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _elevationService: ElevationService
  ) {
    this._store.select(this._hikeEditMapSelectors.getMapId)
      .filter(id => id !== '')
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

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

  public getControl(index) {
    return this._controls[index];
  }

  public pop() {
    const _indexToRemove = this._controls.length - 1;
    const _control: L.Routing.Control | undefined = this._controls.pop();

    if (typeof _control === 'undefined') {
      return;
    }

    this._map.leafletMap.removeControl(_control);

    this._routePlannerService.removeLastSegment();

    return _control;
  }

  private _createMarker(name, latLng) {
    const _icon = L.divIcon({
      html: `<span>${name}</span>`,
      iconSize: [25, 41],
      iconAnchor: [13, 41]
    });

    const _marker = L.marker(latLng, {
      opacity: 1,
      draggable: true,
      icon: _icon
    });

    _marker.addTo(this._map.leafletMap);

    return _marker;
  }

  public addNew() {
    const _control: L.Routing.Control = new L.Routing.Control({
      routeWhileDragging: true,
      autoRoute: false,
      fitSelectedRoutes: 'smart',
      router: L.Routing.graphHopper(environment.graphhopper.apiKey, {
        urlParameters: {
          vehicle: 'hike',
          instructions: false
        }
      }),
      plan: new L.Routing.Plan([], {
        createMarker: (waypointNum, waypoint) => {
          if (typeof waypoint === 'undefined') {
            return;
          }
          return this._createMarker(waypoint.name, waypoint.latLng);
        }
      })
    });

    _control.addTo(this._map.leafletMap);
    _control.hide();

    _control.on('routingstart', () => {
      this._store.dispatch(new routingActions.RoutingStart());
      this._map.leafletMap.spin(true);
    });

    _control.on('routesfound', (e) => {
      // GraphHopper format fix
      let _coordsArr = e.routes[0].coordinates.map(coord => [coord.lat, coord.lng]);

      // Google Elevation Service
      // 2,500 free requests per day
      // 512 locations per request.
      // 50 requests per second
      let _chunks: any[][] = _.chunk(_coordsArr, 500);

      return Observable
        .interval(100)
        .take(_chunks.length)
        .map(counter => {
          const _chunkCoords: any[] = _chunks[counter];

          return this._elevationService.getData(_chunkCoords).then((data) => {
            // Update elevation only if we got all data
            if (data.length === _chunkCoords.length) {
              for (let i in _chunkCoords) {
                _chunkCoords[i][2] = data[i][2];
              }
            }
            return Observable.of(counter);
          });
        })
        .combineAll()
        .toPromise()
        .then(() => {
          const upDown = {
            uphill: this._elevationService.calculateUphill(_coordsArr),
            downhill: this._elevationService.calculateDownhill(_coordsArr)
          };

          this._routePlannerService.addRouteSegment(_coordsArr, e.routes[0].summary, upDown);
          this._store.dispatch(new routingActions.RoutingFinished());
          this._map.leafletMap.spin(false);
        }).catch(() => {
          this._store.dispatch(new routingActions.RoutingError());
          this._map.leafletMap.spin(false);
        });
    });

    _control.on('routingerror', (e) => {
      this._store.dispatch(new routingActions.RoutingError());
      this._map.leafletMap.spin(false);
    });

    this._controls.push(_control);

    return _control;
  }
}
