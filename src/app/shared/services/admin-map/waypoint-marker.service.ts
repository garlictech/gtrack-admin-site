import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../../../store';
import { hikeEditRoutePlannerActions } from '../../../store/actions';
import { of, interval } from 'rxjs';
import { filter, take, flatMap, combineAll } from 'rxjs/operators';
import { HikeEditMapSelectors } from '../../../store/selectors';
import { AdminMapService } from './admin-map.service';
import { RoutePlannerService } from './route-planner.service';
import { AdminMap } from './lib/admin-map';
import { HttpClient } from '../../../../../node_modules/@angular/common/http';
import { environment } from 'environments/environment';
import { ElevationService, IconService } from 'subrepos/gtrack-common-ngx';

import * as L from 'leaflet';
import _map from 'lodash-es/map';
import _chunk from 'lodash-es/chunk';
import { point as turfPoint, lineString as turfLineString } from '@turf/helpers';
import turfNearestPointOnLine from '@turf/nearest-point-on-line';

export interface IRoutePlanResult {
  coordsArr: any,
  upDown: any
}

@Injectable()
export class WaypointMarkerService {
  private _map: AdminMap;
  private _markers: L.Marker[] = [];

  constructor(
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _routePlannerService: RoutePlannerService,
    private _elevationService: ElevationService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _iconService: IconService,
    private _http: HttpClient,
  ) {
    this._store
      .pipe(
        select(this._hikeEditMapSelectors.getMapId),
        filter(id => id !== '')
      )
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    this.reset();
  }

  public reset() {
    for (const marker of this._markers) {
      if (this._map.leafletMap.hasLayer(marker)) {
        this._map.leafletMap.removeLayer(marker);
      }
    }
    this._markers = [];
    this._store.dispatch(new hikeEditRoutePlannerActions.ResetRoutePlanningState());
  }

  public removeSegments(idx, count) {
    for (let i = idx; i <= idx + count; i++) {
      const marker = this._markers[i];
      if (this._map.leafletMap.hasLayer(marker)) {
        this._map.leafletMap.removeLayer(marker);
      }
    }
    this._markers.splice(idx, count + 1);
    this._store.dispatch(new hikeEditRoutePlannerActions.RemoveSegments(idx, count));
  }

  public insertNewStartPoint(latlng: L.LatLng) {
    const _waypoint = {
      latLng: latlng,
      name: 1
    };
    this._markers.unshift(this._createMarker(_waypoint));

    this._updateMarkerNumbers();
    this._refreshEndpointMarkerIcons();
  }

  public insertNewEndPoint(latlng: L.LatLng) {
    const _waypoint = {
      latLng: latlng,
      name: 1
    };
    this._markers.push(this._createMarker(_waypoint));

    this._updateMarkerNumbers();
    this._refreshEndpointMarkerIcons();
  }

  public removeLast() {
    // Remove last marker
    if (this._markers.length > 0) {
      this._map.leafletMap.removeLayer(this._markers.pop());
    }
    // Remove last segment
    this._routePlannerService.removeLastSegment();
    this._refreshEndpointMarkerIcons();
  }

  public closeCircle() {
    if (this._markers.length > 0) {
      this.addWaypoints([this._markers[0].getLatLng()]);
    }
  }

  public async addWaypoints(latlngs: L.LatLng[]) {
    this._map.leafletMap.spin(true);
    this._store.dispatch(new hikeEditRoutePlannerActions.RoutingStart());

    for (const idx in latlngs) {
      if (latlngs[idx]) {
        const _waypoint = {
          latLng: latlngs[idx],
          name: this._markers.length + 1
        };
        this._markers.push(this._createMarker(_waypoint));

        if (this._markers.length > 1) {
          await this.getRouteFromApi(
            this._markers[this._markers.length - 2].getLatLng(),
            this._markers[this._markers.length - 1].getLatLng()
          ).then((data: IRoutePlanResult) => {
            this._routePlannerService.addRouteSegment(data.coordsArr, data.upDown);
            this._moveLastWaypointToRoute(data.coordsArr);
          })
        }
      }
    }

    this._refreshEndpointMarkerIcons();

    this._store.dispatch(new hikeEditRoutePlannerActions.RoutingFinished());
    this._map.leafletMap.spin(false);
  }

  private _createMarker(_waypoint) {
    const _icon =  this._getSingleMarkerIcon(_waypoint.name);
    const _marker = L.marker(_waypoint.latLng, {
      opacity: 1,
      draggable: false, // Maybe later...
      icon: _icon,
      alt: (_waypoint.name - 1).toString() // orderID
    });

    /* // Maybe later...
    _marker.on('dragend', function (e) {
      console.log('marker drag end event', e);
    });
    */

    _marker.addTo(this._map.leafletMap);

    return _marker;
  }

  private _updateMarkerNumbers() {
    for (const idx in this._markers) {
      this._markers[idx].setIcon(this._getSingleMarkerIcon(parseInt(idx, 10) + 1));
    }
  }

  private _getSingleMarkerIcon(title) {
    return L.divIcon({
      html: `<span>${title}</span>`,
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      className: 'routing-control-marker'
    });
  }

  public _refreshEndpointMarkerIcons() {
    for (let i = 1; i < this._markers.length - 1; i++) {
      this._markers[i].setIcon(this._getSingleMarkerIcon(i + 1));
    }
    if (this._markers.length > 0) {
      this._markers[0].setIcon(this._iconService.getLeafletIcon(['start'], 'default'));
      this._markers[0].setZIndexOffset(10000);

      this._markers[this._markers.length - 1].setIcon(this._iconService.getLeafletIcon(['finish'], 'default'));
      this._markers[this._markers.length - 1].setZIndexOffset(10000);
    }
  }

  public getRouteFromApi(p1, p2) {
    const _urlParams = {
      vehicle: 'hike',
      instructions: false,
      locale: 'en',
      key: environment.graphhopper.apiKey,
      points_encoded: false
    };
    const _urlParamsStr = _map(_urlParams, (v, k) => `${k}=${v}`);
    const request = `https://graphhopper.com/api/1/route?point=${p1.lat},${p1.lng}&point=${p2.lat},${p2.lng}&${_urlParamsStr.join('&')}`;

    // Get basic poi list
    return this._http.get(request)
      .toPromise()
      .then((data: any) => {
        return this._calculateCoordsElevation(data);
      });
  }

  private _calculateCoordsElevation(routeData: any) {
    // GraphHopper format fix
    const _coordsArr = routeData.paths[0].points.coordinates.map(coord => [coord[1], coord[0]]);

    // Google Elevation Service
    // 2,500 free requests per day
    // 512 locations per request.
    // 50 requests per second
    const _chunks: any[][] = _chunk(_coordsArr, 500);

    return interval(100)
      .pipe(
        take(_chunks.length),
        flatMap(counter => {
          const _chunkCoords: any[] = _chunks[counter];

          return this._elevationService.getData(_chunkCoords).then((data) => {
            // Update elevation only if we got all data
            if (data.length === _chunkCoords.length) {
              for (const i in _chunkCoords) {
                if (_chunkCoords[i]) {
                  _chunkCoords[i][2] = data[i][2];
                }
              }
            }
            return of(counter);
          });
        }),
        combineAll()
      )
      .toPromise()
      .then(() => {
        const upDown = {
          uphill: this._elevationService.calculateUphill(_coordsArr),
          downhill: this._elevationService.calculateDownhill(_coordsArr)
        };

        return {
          coordsArr: _coordsArr,
          upDown: upDown
        }
      }).catch(() => {
        this._store.dispatch(new hikeEditRoutePlannerActions.RoutingError());
        this._map.leafletMap.spin(false);
      });
  }

  /**
   * Move marker positions to line
   */
  private _moveLastWaypointToRoute(coords) {
    for (let i = this._markers.length - 2; i < this._markers.length; i++) {
      const line = turfLineString(coords);
      const pt = turfPoint([this._markers[i].getLatLng().lat, this._markers[i].getLatLng().lng]);
      const snapped = turfNearestPointOnLine(line, pt);

      this._markers[i].setLatLng(new L.LatLng(
        (<any>snapped.geometry).coordinates[0],
        (<any>snapped.geometry).coordinates[1]
      ));
    }
  }
}
