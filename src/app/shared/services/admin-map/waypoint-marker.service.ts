import { environment } from 'environments/environment';
import * as L from 'leaflet';
import _chunk from 'lodash-es/chunk';
import _get from 'lodash-es/get';
import _map from 'lodash-es/map';
import { interval, of } from 'rxjs';
import { combineAll, flatMap, take } from 'rxjs/operators';
import { ElevationService } from 'subrepos/gtrack-common-ngx';

import { Injectable } from '@angular/core';
import { EMarkerType } from '@common.features/leaflet-map/interfaces';
import { LeafletIconService } from '@common.features/leaflet-map/services/leaflet-icon.service';
import { LeafletMapService } from '@common.features/leaflet-map/services/leaflet-map.service';
import { Store } from '@ngrx/store';
import { lineString as turfLineString, point as turfPoint } from '@turf/helpers';
import turfNearestPointOnLine from '@turf/nearest-point-on-line';

import { HttpClient } from '../../../../../node_modules/@angular/common/http';
import { State } from '../../../store';
import { hikeEditRoutePlannerActions } from '../../../store/actions';
import { RoutePlannerService } from './route-planner.service';

export interface IRoutePlanResult {
  coordsArr: any;
  upDown: any;
}

export interface IWaypoint {
  latLng: L.LatLng;
  idx: number;
}

@Injectable()
export class WaypointMarkerService {
  private readonly _waypointMarkers: L.FeatureGroup = new L.FeatureGroup();
  private _markers: Array<L.Marker> = [];
  private _dragging = false;

  constructor(
    private readonly _store: Store<State>,
    private readonly _leafletMapService: LeafletMapService,
    private readonly _routePlannerService: RoutePlannerService,
    private readonly _elevationService: ElevationService,
    private readonly _leafletIconService: LeafletIconService,
    private readonly _http: HttpClient
  ) {
    this.reset();
  }

  reset() {
    for (const marker of this._markers) {
      if (this._waypointMarkers.hasLayer(marker)) {
        this._waypointMarkers.removeLayer(marker);
      }
    }

    this._markers = [];
    this._store.dispatch(new hikeEditRoutePlannerActions.ResetRoutePlanningState());
  }

  removeSegments(idx, count) {
    for (let i = idx; i <= idx + count; i++) {
      const marker = this._markers[i];
      if (this._waypointMarkers.hasLayer(marker)) {
        this._waypointMarkers.removeLayer(marker);
      }
    }
    this._markers.splice(idx, count + 1);
    this._store.dispatch(new hikeEditRoutePlannerActions.RemoveSegments(idx, count));
  }

  insertNewStartPoint(latlng: L.LatLng) {
    const _waypoint: IWaypoint = {
      latLng: latlng,
      idx: 0
    };
    this._markers.unshift(this._createMarker(_waypoint));

    this._updateMarkerNumbers();
    this._refreshEndpointMarkerIcons();
  }

  insertNewEndPoint(latlng: L.LatLng) {
    const _waypoint: IWaypoint = {
      latLng: latlng,
      idx: this._markers.length
    };
    this._markers.push(this._createMarker(_waypoint));

    this._updateMarkerNumbers();
    this._refreshEndpointMarkerIcons();
  }

  removeLast() {
    // Remove last marker
    if (this._markers.length > 0) {
      this._waypointMarkers.removeLayer(this._markers.pop());
    }
    // Remove last segment
    this._routePlannerService.removeLastSegment();
    this._refreshEndpointMarkerIcons();
  }

  closeCircle() {
    if (this._markers.length > 0) {
      this.addWaypoints([this._markers[0].getLatLng()]);
    }
  }

  async addWaypoints(latlngs: Array<L.LatLng>) {
    if (this._dragging) {
      return;
    }

    // this._leafletMapService.spin(true);

    this._store.dispatch(new hikeEditRoutePlannerActions.RoutingStart());

    for (const idx in latlngs) {
      if (latlngs[idx]) {
        const _waypoint: IWaypoint = {
          latLng: latlngs[idx],
          idx: parseInt(idx, 0) + this._markers.length
        };
        this._markers.push(this._createMarker(_waypoint));

        if (this._markers.length > 1) {
          await this.getRouteFromApi(
            this._markers[this._markers.length - 2].getLatLng(),
            this._markers[this._markers.length - 1].getLatLng()
          ).then((data: IRoutePlanResult) => {
            this._routePlannerService.addRouteSegment(data.coordsArr, data.upDown);
            this._moveLastWaypointToRoute(data.coordsArr);
          });
        }
      }
    }

    this._refreshEndpointMarkerIcons();

    this._store.dispatch(new hikeEditRoutePlannerActions.RoutingFinished());

    // this._leafletMapService.spin(false);
  }

  _refreshEndpointMarkerIcons() {
    for (let i = 0; i < this._markers.length; i++) {
      this._markers[i].setIcon(this._getSingleMarkerIcon(i + 1));
      (this._markers[i] as any).options.idx = i;
    }

    if (this._markers.length > 0) {
      this._markers[0].setIcon(this._leafletIconService.getLeafletIcon(['start'], 'default'));
      this._markers[0].setZIndexOffset(10000);

      this._markers[this._markers.length - 1].setIcon(this._leafletIconService.getLeafletIcon(['finish'], 'default'));
      this._markers[this._markers.length - 1].setZIndexOffset(10000);
    }

    this._leafletMapService.addLayer(this._waypointMarkers);

    this._leafletMapService.refreshSpiderfierMarkers(this._markers, EMarkerType.WAYPOINT);
  }

  getRouteFromApi(p1, p2) {
    const _urlParams = {
      vehicle: 'hike',
      instructions: false,
      locale: 'en',
      key: environment.graphhopper.apiKey,
      points_encoded: false
    };
    const _urlParamsStr = _map(_urlParams, (v, k) => `${k}=${v}`);
    const request = `https://graphhopper.com/api/1/route?point=${p1.lat},${p1.lng}&point=${p2.lat},${
      p2.lng
    }&${_urlParamsStr.join('&')}`;

    // Get basic poi list
    return this._http
      .get(request)
      .toPromise()
      .then((data: any) => this._calculateCoordsElevation(data));
  }

  private _createMarker(_waypoint: IWaypoint) {
    const _icon = this._getSingleMarkerIcon((_waypoint.idx + 1).toString());
    const _marker = L.marker(_waypoint.latLng, {
      opacity: 1,
      draggable: true,
      icon: _icon,
      alt: _waypoint.idx.toString() // orderID
    }) as any;
    _marker.options.type = EMarkerType.WAYPOINT;
    _marker.options.idx = _waypoint.idx;

    _marker.on('click', e => e.originalEvent.preventDefault());
    _marker.on('dragstart', _ => (this._dragging = true));
    _marker.on('dragend', e => {
      this._dragging = false;
      if (this._markers.length > 1) {
        this._refreshSegmentsAfterDrag(e.target.options.idx);
      }
    });

    _marker.addTo(this._waypointMarkers);

    return _marker;
  }

  private _updateMarkerNumbers() {
    for (let i = 0; i < this._markers.length; i++) {
      this._markers[i].setIcon(this._getSingleMarkerIcon(i + 1));
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

  private _calculateCoordsElevation(routeData: any) {
    // GraphHopper format fix
    const _coordsArr = routeData.paths[0].points.coordinates.map(coord => [coord[1], coord[0]]);

    // Google Elevation Service
    // 2,500 free requests per day
    // 512 locations per request.
    // 50 requests per second
    const _chunks: Array<Array<any>> = _chunk(_coordsArr, 500);

    return interval(100)
      .pipe(
        take(_chunks.length),
        flatMap(counter => {
          const _chunkCoords: Array<any> = _chunks[counter];

          return this._elevationService.getData(_chunkCoords).then(data => {
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
          upDown
        };
      })
      .catch(() => {
        this._store.dispatch(new hikeEditRoutePlannerActions.RoutingError());
        // this._leafletMapService.spin(false);
      });
  }

  /**
   * Move marker positions to line
   */
  private _moveLastWaypointToRoute(coords) {
    for (let i = this._markers.length - 2; i < this._markers.length; i++) {
      const line = turfLineString(coords);
      const pt = turfPoint([this._markers[i].getLatLng().lat, this._markers[i].getLatLng().lng]);
      const snapped = turfNearestPointOnLine(line, pt);

      this._markers[i].setLatLng(
        new L.LatLng((snapped.geometry as any).coordinates[0], (snapped.geometry as any).coordinates[1])
      );
    }
  }

  private _refreshSegmentsAfterDrag(markerIdx: number) {
    // Update the first segment
    if (markerIdx === 0) {
      const start = this._markers[0].getLatLng();
      const end = this._markers[1].getLatLng();
      this._getRouteAndUpdateSegment(start, end, 0);
      // Update the last segment
    } else if (markerIdx === this._markers.length - 1) {
      const lastIdx = this._markers.length - 1;
      const start = this._markers[lastIdx - 1].getLatLng();
      const end = this._markers[lastIdx].getLatLng();
      this._getRouteAndUpdateSegment(start, end, lastIdx - 1);
      // Update segment pairs
    } else {
      const start1 = this._markers[markerIdx - 1].getLatLng();
      const end1 = this._markers[markerIdx].getLatLng();
      this._getRouteAndUpdateSegment(start1, end1, markerIdx - 1);

      const start2 = this._markers[markerIdx].getLatLng();
      const end2 = this._markers[markerIdx + 1].getLatLng();
      this._getRouteAndUpdateSegment(start2, end2, markerIdx);
    }
  }

  private _getRouteAndUpdateSegment(start: L.LatLng, end: L.LatLng, segmentIdx: number) {
    this.getRouteFromApi(start, end).then((data: IRoutePlanResult) => {
      this._routePlannerService.updateRouteSegment(segmentIdx, data.coordsArr, data.upDown);
    });
  }
}
