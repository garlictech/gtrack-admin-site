import { BIG_BUFFER_SIZE } from 'app/config';
import { geoBounds as d3GeoBounds } from 'd3-geo';
import * as rewind from 'geojson-rewind';
import * as L from 'leaflet';
import _cloneDeep from 'lodash-es/cloneDeep';
import _omit from 'lodash-es/omit';
import { take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { GameRuleService } from '@bit/garlictech.angular-features.common.game-rule';
import { Segment } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { GEOJSON_STYLES } from '@bit/garlictech.angular-features.common.leaflet-map';
import { LeafletMapService } from '@bit/garlictech.angular-features.common.leaflet-map/services';
import { RouteService } from '@bit/garlictech.angular-features.common.route';
import { select, Store } from '@ngrx/store';
import turfBuffer from '@turf/buffer';
import { lineString as turfLineString } from '@turf/helpers';
import turfLength from '@turf/length';

import { State } from '../../../store';
import { hikeEditRoutePlannerActions } from '../../../store/actions';
import { initialRouteDataState } from '../../../store/reducer';
import * as hikeEditRoutePlannerSelectors from '../../../store/selectors/hike-edit-route-planner';

@Injectable()
export class RoutePlannerService {
  private _savedRouteOnMap: L.FeatureGroup;
  private _routePlanOnMap: L.FeatureGroup;

  constructor(
    private readonly _store: Store<State>,
    private readonly _gameRuleService: GameRuleService,
    private readonly _routeService: RouteService,
    private readonly _leafletMapService: LeafletMapService
  ) {
    // Update totals on each segment update
    this._store.pipe(select(hikeEditRoutePlannerSelectors.getSegments)).subscribe((segments: Array<Segment>) => {
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
  addRouteToTheStore(route): void {
    const _geoJSON = _cloneDeep(route);

    this._store.dispatch(new hikeEditRoutePlannerActions.AddRoute(_geoJSON));
  }

  addRouteSegment(coordinates, updown): void {
    const _segment: Segment = this.createRouteSegment(coordinates, updown);

    // Add segment to store
    this._store.dispatch(new hikeEditRoutePlannerActions.PushSegment(_segment));
  }

  updateRouteSegment(segmentIdx, coordinates, updown): void {
    const _segment: Segment = this.createRouteSegment(coordinates, updown);

    // Update segment
    this._store.dispatch(new hikeEditRoutePlannerActions.UpdateSegment(segmentIdx, _segment));
  }

  createRouteSegment(coordinates, updown): Segment {
    const _segment: Segment = {
      distance: turfLength(turfLineString(coordinates), { units: 'kilometers' }) * 1000, // summary.totalDistance, // in meters
      uphill: updown.uphill,
      downhill: updown.downhill,
      coordinates
    };

    // Now, things according to the game rules
    _segment.time = this._gameRuleService.segmentTime(_segment.distance, _segment.uphill);
    _segment.score = this._gameRuleService.score(_segment.distance, _segment.uphill);

    return _segment;
  }

  removeLastSegment(): void {
    this._store.dispatch(new hikeEditRoutePlannerActions.PopSegment());
  }

  /**
   * Get path bounds for POI search
   */
  getSearchBounds(): any {
    let _bounds;

    this._store
      .pipe(
        select(hikeEditRoutePlannerSelectors.getPath),
        take(1)
      )
      .subscribe(path => {
        // declare as 'any' for avoid d3.geoBounds error
        const _buffer: any = turfBuffer(path, BIG_BUFFER_SIZE, { units: 'meters' });

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
          _bounds = undefined;
        }
      });

    return _bounds;
  }

  /**
   * Create multi-line group from a LineString
   */
  drawRouteLineGeoJSON(geoJSON): void {
    if (this._savedRouteOnMap) {
      this._leafletMapService.removeLayer(this._savedRouteOnMap);
      delete this._savedRouteOnMap;
    }

    this._savedRouteOnMap = this._leafletMapService.addLayer(
      this._leafletMapService.createFeatureGroupFromGeoJSONObject(geoJSON, GEOJSON_STYLES.routeMultiline)
    ) as L.FeatureGroup;
  }

  /**
   * Refresh route path after save
   */
  refreshRouteOnMap(): void {
    this._store
      .pipe(
        select(hikeEditRoutePlannerSelectors.getPath),
        take(1)
      )
      .subscribe((path: any) => {
        this.drawRouteLineGeoJSON(path);
      });
  }

  /**
   * Create multi-line group from a LineString
   */
  drawRoutePlanGeoJSON(geoJSON): void {
    if (this._leafletMapService.leafletMap) {
      if (this._routePlanOnMap) {
        this._leafletMapService.removeLayer(this._routePlanOnMap);
        delete this._routePlanOnMap;
      }

      this._routePlanOnMap = this._leafletMapService.addLayer(
        this._leafletMapService.createFeatureGroupFromGeoJSONObject(geoJSON, GEOJSON_STYLES.routePlanMultiline)
      ) as L.FeatureGroup;
    }
  }

  /**
   * Create track from geoJson
   */
  private _createGeoJsonFromSegments(segments: Array<Segment>): any {
    const _geoJSON: any = _cloneDeep(initialRouteDataState);

    segments.forEach((segment, i) => {
      // Add segment coords to LineString
      for (const p of segment.coordinates) {
        _geoJSON.features[0].geometry.coordinates.push([p[0], p[1], p[2]]);
      }

      // Add the segment start point
      _geoJSON.features.push(this._createRoutePoint(segment.coordinates[0], i + 1));
    });

    // Add the last route point: the last point of the last segment
    if (segments.length > 0) {
      _geoJSON.features.push(this._createRoutePoint(this._getLastPointOfLastSegment(segments), segments.length + 1));
    }

    if (segments.length > 0) {
      _geoJSON.bounds = this._routeService.getBounds(_geoJSON);
    }

    return _geoJSON;
  }

  // tslint:disable-next-line:prefer-function-over-method
  private _calculateTotal(segments: Array<any>): any {
    const total = {};

    for (const segment of segments) {
      for (const key in _omit(segment, 'coordinates')) {
        if (typeof segment[key] !== 'undefined') {
          if (typeof total[key] === 'undefined') {
            total[key] = 0;
          }
          total[key] += segment[key];
        }
      }
    }

    return total;
  }

  /**
   * _createGeoJsonFromSegments submethod
   */
  // tslint:disable-next-line:prefer-function-over-method
  private _createRoutePoint(dataPoint, index): any {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [dataPoint[0], dataPoint[1], dataPoint[2]]
      },
      properties: {
        name: `Route point ${index}`
      }
    };
  }

  /**
   * _createGeoJsonFromSegments submethod
   */
  // tslint:disable-next-line:prefer-function-over-method
  private _getLastPointOfLastSegment(segments: Array<Segment>): any {
    const _lastSegment = segments[segments.length - 1];
    const _coordinateNumInLastSegment = _lastSegment.coordinates.length;

    return _lastSegment.coordinates[_coordinateNumInLastSegment - 1];
  }
}
