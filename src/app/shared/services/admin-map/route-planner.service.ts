import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { State } from '../../../store';
import { hikeEditRoutePlannerActions } from '../../../store/actions';
import { GameRuleService, ISegment, RouteService } from 'subrepos/gtrack-common-ngx';
import { initialRouteDataState } from '../../../store/reducer';
import { HikeEditRoutePlannerSelectors, HikeEditMapSelectors } from '../../../store/selectors';
import { AdminMap } from './lib/admin-map';
import { AdminMapService } from './admin-map.service';

import * as L from 'leaflet';
import * as rewind from 'geojson-rewind';
import _cloneDeep from 'lodash-es/cloneDeep';
import turfBuffer from '@turf/buffer';
import { lineString as turfLineString } from '@turf/helpers';
import turfLength from '@turf/length';
import { geoBounds as d3GeoBounds } from 'd3-geo';

@Injectable()
export class RoutePlannerService {
  private _map: AdminMap;
  private _savedRouteOnMap: L.FeatureGroup;
  private _routePlanOnMap: L.FeatureGroup;

  constructor(
    private _store: Store<State>,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _gameRuleService: GameRuleService,
    private _routeService: RouteService,
    private _adminMapService: AdminMapService,
  ) {
    this._store
      .pipe(
        select(this._hikeEditMapSelectors.getMapId),
        filter(id => id !== '')
      )
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    // Update totals on each segment update
    this._store
      .pipe(select(this._hikeEditRoutePlannerSelectors.getSegments))
      .subscribe((segments: ISegment[]) => {
        // Update total for route info
        this._store.dispatch(new hikeEditRoutePlannerActions.UpdateTotal(this._calculateTotal(segments)));

        // Refresh route data and draw to map
        const _route = this._createGeoJsonFromSegments(segments);
        this._store.dispatch(new hikeEditRoutePlannerActions.AddRoute(_route));
        this.drawRoutePlanGeoJSON(_route.features[0]);
      });
  }

  /**
   * Add the loaded route to the store
   * This is an initial loading method, the segment based route drawing will replace it.
   */
  public addRouteToTheStore(route) {
    const _geoJSON = _cloneDeep(route);

    this._store.dispatch(new hikeEditRoutePlannerActions.AddRoute(_geoJSON));
  }

  public addRouteSegment(coordinates, updown) {
    const _segment: ISegment = {
      distance: turfLength(turfLineString(coordinates), { units: 'kilometers' }) * 1000, // summary.totalDistance, // in meters
      uphill: updown.uphill,
      downhill: updown.downhill,
      coordinates: coordinates
    };

    // Now, things according to the game rules
    _segment.time = this._gameRuleService.segmentTime(_segment.distance, _segment.uphill),
    _segment.score = this._gameRuleService.score(_segment.distance, _segment.uphill);

    // Add segment to store
    this._store.dispatch(new hikeEditRoutePlannerActions.PushSegment(_segment));
  }

  public removeLastSegment() {
    this._store.dispatch(new hikeEditRoutePlannerActions.PopSegment());
  }

  /**
   * Segment subscription submethod
   */
  private _calculateTotal(segments) {
    const total = {};

    for (const segment of segments) {
      for (const key in segment) {
        if (segment[key]) {
          if (!total[key]) {
            total[key] = 0;
          }
          total[key] += segment[key];
        }
      }
    }

    return total;
  }

  /**
   * Create track from geoJson
   */
  private _createGeoJsonFromSegments(segments) {
    const _geoJSON: any = _cloneDeep(initialRouteDataState);

    for (const i in segments) {
      if (segments[i]) {
        // Add segment coords to LineString
        const _segment = segments[i];
        for (const p of _segment.coordinates) {
          _geoJSON.features[0].geometry.coordinates.push([p[1], p[0], p[2]]);
        }

        // Add the segment start point
        _geoJSON.features.push(<any>(this._createRoutePoint(_segment.coordinates[0], i + 1)));
      }
    }

    // Add the last route point: the last point of the last segment
    if (segments.length > 0) {
      _geoJSON.features.push(<any>(this._createRoutePoint(this._getLastPointOfLastSegment(segments), segments.length + 1)));
    }

    if (segments.length > 0) {
      _geoJSON.bounds = this._routeService.getBounds(_geoJSON);
    }

    return _geoJSON;
  }

  /**
   * _createGeoJsonFromSegments submethod
   */
  private _createRoutePoint(dataPoint, index) {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [dataPoint[1], dataPoint[0], dataPoint[2]]
      },
      properties: {
        name: `Route point ${index}`
      }
    };
  }

  /**
   * _createGeoJsonFromSegments submethod
   */
  private _getLastPointOfLastSegment(segments) {
    const _lastSegment = segments[segments.length - 1];
    const _coordinateNumInLastSegment = _lastSegment.coordinates.length;

    return _lastSegment.coordinates[_coordinateNumInLastSegment - 1];
  }

  /**
   * Get path bounds for POI search
   */
  public getSearchBounds() {
    let _bounds;

    this._store
      .pipe(
        select(this._hikeEditRoutePlannerSelectors.getPath),
        take(1)
      )
      .subscribe((path) => {
        // declare as 'any' for avoid d3.geoBounds error
        const _buffer: any = turfBuffer(path, 1000, { units: 'meters' });

        if (typeof _buffer !== 'undefined') {
          const _geoBounds = d3GeoBounds(rewind(_buffer, true));

          _bounds = {
            SouthWest: {
              lat: _geoBounds[0][1],
              lon: _geoBounds[0][0]
            },
            NorthEast: {
              lat: _geoBounds[1][1],
              lon: _geoBounds[1][0]
            }
          };
        } else {
          _bounds = null;
        }
      });

    return _bounds;
  }

  /**
   * Create multi-line group from a LineString
   */
  public drawRouteLineGeoJSON(geoJSON) {
    if (this._savedRouteOnMap) {
      this._map.removeGeoJSON(this._savedRouteOnMap);
      delete this._savedRouteOnMap;
    }

    this._savedRouteOnMap = new L.FeatureGroup();
    const styles = [
      { color: 'black',   opacity: 0.15,  weight: 12 },
      { color: 'white',   opacity: 0.8,   weight: 8 },
      { color: '#722ad6', opacity: 1,     weight: 3 }
    ];

    for (const num of [0, 1, 2]) {
      this._savedRouteOnMap.addLayer(L.geoJSON(geoJSON, {
        style: <any>styles[num]
      }));
    }
    this._savedRouteOnMap.addTo(this._map.leafletMap);
  }

  /**
   * Refresh route path after save
   */
  public refreshRouteOnMap() {
    this._store
      .pipe(
        select(this._hikeEditRoutePlannerSelectors.getPath),
        take(1)
      )
      .subscribe((path: any) => {
        this.drawRouteLineGeoJSON(path);
      });
  }

  /**
   * Create multi-line group from a LineString
   */
  public drawRoutePlanGeoJSON(geoJSON) {
    if (this._map) {
      if (this._routePlanOnMap) {
        this._map.removeGeoJSON(this._routePlanOnMap);
        delete this._routePlanOnMap;
      }

      this._routePlanOnMap = new L.FeatureGroup();
      const styles = [
        { color: 'black',   opacity: 0.15,  weight: 12 },
        { color: 'white',   opacity: 0.8,   weight: 8 },
        { color: '#F60000', opacity: 1,     weight: 3 }
      ];

      for (const num of [0, 1, 2]) {
        this._routePlanOnMap.addLayer(L.geoJSON(geoJSON, {
          style: <any>styles[num]
        }));
      }
      this._routePlanOnMap.addTo(this._map.leafletMap);
    }
  }
}
